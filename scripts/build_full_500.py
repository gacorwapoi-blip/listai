# scripts/build_full_500.py
import json

CATEGORIES_META = {
    'coding': {'label': 'Coding & Dev', 'color': '#38BDF8', 'icon': 'Code2'},
    'research': {'label': 'Research & Scholar', 'color': '#A78BFA', 'icon': 'BookOpen'},
    'automation': {'label': 'Automation & Agent', 'color': '#FFB454', 'icon': 'Cpu'},
    'content': {'label': 'Content & Media', 'color': '#FB7185', 'icon': 'Video'},
    'data': {'label': 'Data & Trading', 'color': '#4ADE80', 'icon': 'LineChart'},
    'productivity': {'label': 'Productivity & Second Brain', 'color': '#FACC15', 'icon': 'CheckSquare'},
    'builder': {'label': 'AI Builder & Local LLM', 'color': '#22D3EE', 'icon': 'Blocks'},
}

print("Category metadata ready.")
