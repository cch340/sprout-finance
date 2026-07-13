#!/usr/bin/env python3
"""Deterministic converter: Financial_Report_2026.xlsx -> src/data/seed-sheet.json

Reads the user's real financial spreadsheet and emits a checked-in JSON seed in
the repo's SeedData shape (spaces overrides + full Tx list + recurring +
household). Re-runnable: stable ids (sheet-<space>-NNN), sorted deterministic
output. Prints a conversion summary and also writes scripts/convert-sheet-summary.txt.

Sheet5 is a scratch tab and is ignored. seed-demo.ts is left untouched (unit-test
fixture). See scripts/convert-sheet-summary.txt for mapping decisions.
"""
import json
import re
import datetime
from pathlib import Path

import openpyxl

SRC = "/root/.claude/uploads/406bd9e4-8113-5f24-808b-700cb49756c5/f90d4c0b-Financial_Report_2026.xlsx"
ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "src" / "data" / "seed-sheet.json"
OUT_SUMMARY = ROOT / "scripts" / "convert-sheet-summary.txt"

# ---- helpers -------------------------------------------------------------
_EMOJI_RE = re.compile(r"[\U00002600-\U0001FAFF️]")


def strip_emoji(s):
    return _EMOJI_RE.sub("", str(s)).strip()


def to_iso(v):
    """datetime -> ISO; 'd/m/yyyy' (maybe with trailing text) -> ISO; else None."""
    if isinstance(v, (datetime.datetime, datetime.date)):
        return v.strftime("%Y-%m-%d")
    if isinstance(v, str):
        m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", v)
        if m:
            d, mo, y = (int(x) for x in m.groups())
            return f"{y:04d}-{mo:02d}-{d:02d}"
    return None


def money(v):
    if v is None:
        return None
    try:
        return round(float(v) + 0.0, 2)
    except (TypeError, ValueError):
        return None


summary_lines = []


def log(line=""):
    summary_lines.append(line)
    print(line)


wb = openpyxl.load_workbook(SRC, data_only=True)

txs = []  # full Tx dicts, appended in deterministic sheet order
skips = {}  # sheet -> list[str]


def note_skip(sheet, reason):
    skips.setdefault(sheet, []).append(reason)


def add_tx(space, seq, *, title, cat, amount, date, dir="out", payer=None,
           status=None, note="", fields=None):
    tid = f"sheet-{space}-{seq:03d}"
    fv = {"vendor": title}
    if fields:
        fv.update({k: v for k, v in fields.items() if v not in (None, "")})
    tx = {
        "id": tid, "spaceId": space, "title": title, "fieldValues": fv,
        "note": note or "", "cat": cat, "amount": amount, "date": date, "dir": dir,
    }
    if payer:
        tx["payer"] = payer
    if status:
        tx["status"] = status
    txs.append(tx)


counts = {}


def rows(name):
    return list(wb[name].iter_rows(values_only=True))


# ==== Expenses -> 'expenses' =============================================
def cat_expenses(details, vendor):
    text = f"{details or ''} {vendor or ''}".lower()
    baby = ["leo", "milk", "diaper", "huggies", "similac", "pacifier", "baby",
            "辅食", "ribena"]
    grocery = ["grocery", "groceries", "fruit", "vege", "meat", "pasar", "salmon"]
    meals = ["meal", "lunch", "dinner", "laksa", "kopitiam", "pharmacy"]
    shopping = ["clothes", "shirt", "cloth"]
    if any(k in text for k in baby):
        return "baby"
    if any(k in text for k in grocery):
        return "grocery"
    if any(k in text for k in meals):
        return "meals"
    if any(k in text for k in shopping):
        return "shopping"
    return "other"


def convert_expenses():
    seq = 0
    converted = 0
    last_iso = None
    for i, r in enumerate(rows("Expenses")):
        if i == 0:
            continue  # header
        date_c, vendor, location, details, amount = r[0], r[1], r[2], r[3], r[4]
        amt = money(amount)
        if amt is None:
            continue
        if vendor is None and details is None:
            note_skip("Expenses", f"row {i}: totals row RM{amt} skipped")
            continue
        iso = to_iso(date_c)
        if iso:
            last_iso = iso
        elif last_iso:
            iso = last_iso  # date carried down (trailing rows w/o a date)
        else:
            note_skip("Expenses", f"row {i}: no date, amount {amt} skipped")
            continue
        seq += 1
        title = (str(vendor).strip() if vendor else "Retail")
        loc = None if location in (None, "-", "") else str(location).strip()
        add_tx("expenses", seq, title=title, cat=cat_expenses(details, vendor),
               amount=amt, date=iso, payer="Joint", note=(details or "").strip(),
               fields={"location": loc})
        converted += 1
    counts["expenses"] = converted


# ==== TreeO -> 'housing' =================================================
def convert_housing():
    seq = 0
    converted = 0
    for i, r in enumerate(rows("TreeO")):
        if i == 0:
            continue  # header
        date_c, details, amount, transferred, notes = r[0], r[1], r[2], r[3], r[4]
        amt = money(amount)
        if amt is None or details is None:
            continue
        clean = strip_emoji(details)
        if "carry forward" in clean.lower():
            note_skip("TreeO", f"row {i}: '{clean}' RM{amt} carry-forward -> skipped "
                               "(not a real expense; Housing is a spend space)")
            continue
        low = clean.lower()
        if "monthly commitment" in low:
            cat, provider = "installment", "Maybank"
        elif "electric" in low:
            cat, provider = "electric", "TNB"
        elif "water" in low:
            cat, provider = "water", "PBAPP"
        elif "internet" in low:
            cat, provider = "internet", "Time Fibre"
        else:
            cat, provider = "other", None
        status = "paid" if transferred is True else "due"
        iso = to_iso(date_c)
        if not iso:
            note_skip("TreeO", f"row {i}: '{clean}' bad date -> skipped")
            continue
        seq += 1
        add_tx("housing", seq, title=clean, cat=cat, amount=amt, date=iso,
               payer="Joint", status=status, note=(notes or "").strip(),
               fields={"provider": provider})
        converted += 1
    # right block (Date Paid/Vendor/Details/Amount Paid) = placeholder example rows
    note_skip("TreeO", "right block ignored (only placeholder 'Retail/example' RM0.0)")
    counts["housing"] = converted


# ==== Car -> 'car' =======================================================
def convert_car():
    # (date_col, pay_col, title, cat, note)
    blocks = [
        (0, 1, "Myvi loan", "installment", "Loan settlement"),
        (3, 4, "Myvi road tax + insurance", "roadtax", ""),
        (6, 7, "Myvi service", "maintenance", ""),
        (9, 10, "Alza loan", "installment", "Loan settlement"),
        (12, 13, "Alza road tax + insurance", "roadtax", ""),
        (15, 16, "Alza service", "maintenance", ""),
    ]
    data = rows("Car")[3:]  # data starts at row index 3
    seq = 0
    converted = 0
    for dc, pc, title, cat, note in blocks:
        for r in data:
            if len(r) <= pc:
                continue
            raw_date, raw_amt = r[dc], r[pc]
            if raw_date == "CLOSED" or raw_amt == "CLOSED":
                note_skip("Car", f"{title}: CLOSED row skipped")
                continue
            amt = money(raw_amt)
            if amt is None:
                continue
            iso = to_iso(raw_date)
            if not iso:
                note_skip("Car", f"{title}: unpar- date {raw_date!r} skipped")
                continue
            rownote = note
            extra = re.search(r"\(([^)]+)\)", str(raw_date)) if isinstance(raw_date, str) else None
            if extra:
                rownote = extra.group(1)
            seq += 1
            add_tx("car", seq, title=title, cat=cat, amount=amt, date=iso,
                   payer="Joint", status="paid", note=rownote)
            converted += 1
    counts["car"] = converted


# ==== AIA Investment -> 'investment' =====================================
def convert_investment():
    data = rows("AIA Investment")
    seq = 0
    converted = 0
    # (date_col, pay_col, payer)
    blocks = [(1, 2, "JC"), (4, 5, "CH")]
    total = 0.0
    for dc, pc, payer in blocks:
        for i, r in enumerate(data):
            if i < 2:
                continue  # rows 0,1 = labels/header
            if len(r) <= pc:
                continue
            raw_date, raw_amt = r[dc], r[pc]
            iso = to_iso(raw_date)
            amt = money(raw_amt)
            if iso is None or amt is None:
                continue
            if str(r[0]).strip().lower() == "total":
                continue
            seq += 1
            total += amt
            add_tx("investment", seq, title="AIA contribution", cat="investment",
                   amount=amt, date=iso, dir="out", payer=payer, status="paid",
                   fields={"platform": "AIA"})
            converted += 1
    counts["investment"] = converted
    return round(total, 2)


# ==== Joint Fund -> 'joint' ==============================================
def convert_joint():
    data = rows("Joint Fund")
    carry = money(data[1][13])  # N2 'Carry forward from 2025'
    seq = 0
    converted = 0
    paid_sum = 0.0
    # left block = JC (col 0 date, 1 amount, 2 status); right = CH (6,7,8)
    blocks = [(0, 1, 2, "JC"), (6, 7, 8, "CH")]
    for dc, ac, sc, payer in blocks:
        for i, r in enumerate(data):
            if i < 2:
                continue
            iso = to_iso(r[dc])
            amt = money(r[ac])
            if iso is None or amt is None:
                continue
            transferred = r[sc] is True
            if not transferred:
                note_skip("Joint Fund",
                          f"{payer} {iso} RM{amt} not transferred -> omitted from fund "
                          "ledger (would inflate live balance; sheet Total counts paid only)")
                continue
            seq += 1
            paid_sum += amt
            add_tx("joint", seq, title=f"{payer} contribution", cat="joint",
                   amount=amt, date=iso, dir="in", payer=payer, status="paid",
                   note="Monthly top-up")
            converted += 1
    counts["joint"] = converted
    return carry, round(paid_sum, 2)


# ==== Personal (CH / JC) =================================================
def cat_personal_expense(desc):
    d = desc.lower()
    if "youtube" in d or "apple one" in d or "google ai" in d or "subscription" in d:
        return "subscriptions"
    if "ptptn" in d:
        return "ptptn"
    if "insurance" in d or "allianz" in d or d == "aia":
        return "insurance"
    if "hotlink" in d or "mobile" in d:
        return "mobile"
    if "parent" in d:
        return "parent"
    if "joint fund" in d:
        return "joint"
    if "petrol" in d:
        return "petrol"
    if "sinaran" in d or "rental" in d or "house" in d:
        return "house"
    return "other"


def convert_personal(sheet, space):
    data = rows(sheet)
    seq = 0
    inc = 0
    exp = 0
    cur_month_iso = None
    for i, r in enumerate(data):
        if i < 2:
            continue  # rows 0,1 = section + column headers
        # month date carried down in col A
        iso = to_iso(r[0])
        if iso:
            cur_month_iso = iso[:8] + "01"  # 1st of that month
        # Income block: B desc, C amount
        idesc, iamt = r[1], r[2]
        if idesc and str(idesc).strip() not in ("Total", "Balance") and cur_month_iso:
            a = money(iamt)
            if a is not None and a != 0:
                seq += 1
                cat = "income"
                add_tx(space, seq, title=str(idesc).strip(), cat=cat, amount=a,
                       date=cur_month_iso, dir="in", note="")
                inc += 1
        # Expenses block: F desc(idx5), G amount(idx6)
        edesc = r[5] if len(r) > 5 else None
        eamt = r[6] if len(r) > 6 else None
        if edesc and str(edesc).strip() not in ("Total", "Balance") and cur_month_iso:
            a = money(eamt)
            if a is not None and a != 0:
                seq += 1
                add_tx(space, seq, title=str(edesc).strip(),
                       cat=cat_personal_expense(str(edesc)), amount=a,
                       date=cur_month_iso, dir="out", note="")
                exp += 1
    counts[space] = inc + exp
    return inc, exp


# ---- run all -------------------------------------------------------------
convert_expenses()
convert_housing()
convert_car()
invest_total = convert_investment()
carry, joint_paid = convert_joint()
ch_inc, ch_exp = convert_personal("CH (Personal)", "ch")
jc_inc, jc_exp = convert_personal("JC (Personal)", "jc")

fund_balance = round(carry + joint_paid, 2)

space_overrides = {
    "housing": {"budget": 2090},            # Money breakdown House total 2090
    "investment": {"value": invest_total},  # portfolio cost basis = sum of all AIA payments
    "joint": {"baseBalance": carry},        # carry forward from 2025
}

# Recurring: Money breakdown right block (Housing monthlies) + Joint pattern.
recurring = [
    {"spaceId": "housing", "label": "House installment", "cat": "installment", "amount": 1493.0},
    {"spaceId": "housing", "label": "House maintenance", "cat": "maintenance", "amount": 213.2},
    {"spaceId": "housing", "label": "LG water purifier", "cat": "maintenance", "amount": 50.0},
    {"spaceId": "housing", "label": "LG air purifier", "cat": "maintenance", "amount": 40.0},
    {"spaceId": "housing", "label": "Outdoor water filter", "cat": "maintenance", "amount": 69.44},
    {"spaceId": "housing", "label": "Time Fibre Internet", "cat": "internet", "amount": 104.94},
    {"spaceId": "housing", "label": "Electric Bill (est.)", "cat": "electric", "amount": 120.0},
    {"spaceId": "housing", "label": "Water Bill (est.)", "cat": "water", "amount": 15.0},
    {"spaceId": "joint", "label": "Carry forward from 2025", "cat": "joint", "amount": carry},
    {"spaceId": "joint", "label": "JC monthly contribution", "cat": "joint", "amount": 2270.0},
    {"spaceId": "joint", "label": "CH monthly contribution", "cat": "joint", "amount": 2470.0},
]

household = {
    "people": [
        {"id": "jc", "name": "JC"},
        {"id": "ch", "name": "CH"},
        {"id": "leo", "name": "Leo"},
    ],
    "currency": "RM",
    "onboarded": True,
}

# Deterministic tx ordering: by id.
txs.sort(key=lambda t: t["id"])

payload = {
    "_generated": "scripts/convert-sheet.py from Financial_Report_2026.xlsx — DO NOT EDIT BY HAND",
    "spaceOverrides": space_overrides,
    "household": household,
    "recurring": recurring,
    "txs": txs,
}

OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")

# ---- summary -------------------------------------------------------------
log("=== Sprout sheet conversion summary ===")
log(f"source: {SRC}")
log("")
log("Rows converted per space:")
for k in ["expenses", "housing", "car", "investment", "joint", "ch", "jc"]:
    log(f"  {k:<12} {counts.get(k, 0)}")
log(f"  TOTAL txs    {len(txs)}")
log("")
log(f"Personal income/expense: CH in={ch_inc} out={ch_exp}; JC in={jc_inc} out={jc_exp}")
log(f"Investment portfolio value (sum of all AIA payments) = {invest_total}")
log("")
log("Joint Fund reconciliation:")
log(f"  carry forward from 2025 (baseBalance) = {carry}")
log(f"  paid contributions (in)               = {joint_paid}")
log(f"  live fund balance = base + in - out   = {fund_balance}")
log(f"  sheet 'Total Joint Fund'              = 15158.53")
log(f"  match: {abs(fund_balance - 15158.53) < 0.01}")
log("")
log("Skipped rows / decisions:")
for sheet, reasons in skips.items():
    log(f"  [{sheet}]")
    for rsn in reasons:
        log(f"    - {rsn}")
log("")
log("Ignored sheets: Sheet5 (scratch tab).")
log("")
log("Mapping judgment calls:")
log("  - Everyday budget kept at 1500 (Money breakdown Food=600 too narrow; Everyday")
log("    also covers baby/shopping). Housing budget = 2090 (Money breakdown House total).")
log("  - Car budget kept at 800 (no monthly figure in sheet).")
log("  - Expenses category order: baby > grocery > meals > shopping > other, so")
log("    'Leo shirt' -> baby (child spend), 'New year clothes' -> shopping.")
log("  - Expenses trailing rows without a date inherit the last seen date (2026-06-17).")
log("  - Vendor blank -> title 'Retail'; location '-' dropped.")
log("  - TreeO 'Carry forwarded from year 2025' RM46013.81 NOT recorded as an expense.")
log("  - Car: RM36474.31 (2025-12-31 Myvi) and RM34520 (Alza) kept as real settlement")
log("    payments, note 'Loan settlement'. Alza 'CLOSED' rows skipped.")
log("  - Investment payments recorded dir:'out' (cost basis), payer JC/CH.")
log("  - Joint Fund: JC=left(2270), CH=right(2470) per prompt. Only transferred (paid)")
log("    rows emitted as 'in' so live balance reconciles to the sheet Total 15158.53;")
log("    future/untransferred months omitted (they'd double-count money not yet in).")
log("  - Personal: month date in col A carries down; income & expense both dated the")
log("    1st of that month. JC salary is blank in the sheet -> JC has no income entry.")

OUT_SUMMARY.write_text("\n".join(summary_lines) + "\n")
