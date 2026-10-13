# scripts/build_500_tools.py
import json

# Definisi 500 Tools Lengkap di 7 Kategori
# 1. coding (80 tools)
# 2. research (70 tools)
# 3. automation (70 tools)
# 4. content (80 tools)
# 5. data (65 tools)
# 6. productivity (65 tools)
# 7. builder (70 tools)

tools = []

def add_tool(id, name, cat, desc, func, status, cc, browser, lowend, warnet, vps, apikey, oss, github, site, pros, cons, usecase, diff, money, score):
    tools.append({
        "id": id,
        "name": name,
        "category": cat,
        "desc": desc,
        "func": func,
        "status": status,
        "cc": cc,
        "browser": browser,
        "lowend": lowend,
        "warnet": warnet,
        "vps": vps,
        "apikey": apikey,
        "oss": oss,
        "github": github,
        "site": site,
        "pros": pros,
        "cons": cons,
        "usecase": usecase,
        "difficulty": diff,
        "money": money,
        "score": round(float(score), 1),
        "verify": True
    })

print("Helper initialized.")
