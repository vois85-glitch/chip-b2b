#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ChipNet.ru — Полная концепция сайта поставки электронных компонентов
Генерация PDF документа
"""

import sys, os

# ── Skill path ──
PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
_scripts = os.path.join(PDF_SKILL_DIR, "scripts")
if _scripts not in sys.path:
    sys.path.insert(0, _scripts)

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm, mm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.lib import colors
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, CondPageBreak, Flowable
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import SimpleDocTemplate
import hashlib

# ━━ Color Palette (auto-generated) ━━
ACCENT       = colors.HexColor('#64b6d2')
ACCENT_DARK  = colors.HexColor('#3a7a8f')
TEXT_PRIMARY  = colors.HexColor('#e3e2e0')
TEXT_MUTED    = colors.HexColor('#838077')
BG_SURFACE   = colors.HexColor('#312f29')
BG_PAGE      = colors.HexColor('#0d0d0c')
ACCENT_LIGHT = colors.HexColor('#8ad0e6')
TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = BG_SURFACE
TABLE_ROW_ODD      = colors.HexColor('#242220')
WHITE = colors.white
BLACK = colors.HexColor('#0d0d0c')

PAGE_W, PAGE_H = A4
LEFT_M = 1.8*cm
RIGHT_M = 1.8*cm
TOP_M = 2.2*cm
BOT_M = 2.2*cm
CONTENT_W = PAGE_W - LEFT_M - RIGHT_M

# ━━ Font Registration ━━
pdfmetrics.registerFont(TTFont('SarasaMonoSC', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('SarasaMonoSC-Bold', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Carlito', '/usr/share/fonts/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', '/usr/share/fonts/truetype/english/Carlito-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

registerFontFamily('SarasaMonoSC', normal='SarasaMonoSC', bold='SarasaMonoSC-Bold')
registerFontFamily('LiberationSerif', normal='LiberationSerif', bold='LiberationSerif-Bold')
registerFontFamily('LiberationSans', normal='LiberationSans', bold='LiberationSans-Bold')
registerFontFamily('Carlito', normal='Carlito', bold='Carlito-Bold')
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# Install font fallback for mixed CJK/Latin
from pdf import install_font_fallback
install_font_fallback()

# ━━ Styles ━━
styles = getSampleStyleSheet()

DARK_BG = BG_PAGE

class H1Style(ParagraphStyle):
    pass

h1_style = ParagraphStyle(
    'H1Dark', fontName='LiberationSerif-Bold', fontSize=22, leading=28,
    textColor=ACCENT, spaceBefore=24, spaceAfter=12,
    alignment=TA_LEFT, wordWrap='CJK'
)

h2_style = ParagraphStyle(
    'H2Dark', fontName='LiberationSerif-Bold', fontSize=16, leading=22,
    textColor=ACCENT_LIGHT, spaceBefore=18, spaceAfter=8,
    alignment=TA_LEFT, wordWrap='CJK'
)

h3_style = ParagraphStyle(
    'H3Dark', fontName='Carlito-Bold', fontSize=13, leading=18,
    textColor=TEXT_PRIMARY, spaceBefore=12, spaceAfter=6,
    alignment=TA_LEFT, wordWrap='CJK'
)

body_style = ParagraphStyle(
    'BodyDark', fontName='LiberationSerif', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=0, spaceAfter=6,
    alignment=TA_LEFT, wordWrap='CJK'
)

body_justify = ParagraphStyle(
    'BodyJustify', fontName='LiberationSerif', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=0, spaceAfter=6,
    alignment=TA_JUSTIFY, wordWrap='CJK'
)

bullet_style = ParagraphStyle(
    'BulletDark', fontName='LiberationSerif', fontSize=10.5, leading=17,
    textColor=TEXT_PRIMARY, spaceBefore=2, spaceAfter=3,
    leftIndent=18, bulletIndent=6, alignment=TA_LEFT, wordWrap='CJK'
)

muted_style = ParagraphStyle(
    'MutedDark', fontName='LiberationSerif', fontSize=9.5, leading=14,
    textColor=TEXT_MUTED, spaceBefore=0, spaceAfter=4,
    alignment=TA_LEFT, wordWrap='CJK'
)

caption_style = ParagraphStyle(
    'CaptionDark', fontName='LiberationSerif', fontSize=9, leading=13,
    textColor=TEXT_MUTED, spaceBefore=3, spaceAfter=6,
    alignment=TA_CENTER, wordWrap='CJK'
)

header_cell_style = ParagraphStyle(
    'HeaderCell', fontName='Carlito-Bold', fontSize=10, leading=14,
    textColor=TABLE_HEADER_TEXT, alignment=TA_CENTER, wordWrap='CJK'
)

cell_style = ParagraphStyle(
    'CellDark', fontName='LiberationSerif', fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, wordWrap='CJK'
)

cell_center = ParagraphStyle(
    'CellCenter', fontName='LiberationSerif', fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, wordWrap='CJK'
)

# ━━ Helper: Dark Table ━━
def dark_table(data, col_widths=None, header_rows=1):
    """Create a styled table with dark theme."""
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, header_rows-1), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, header_rows-1), TABLE_HEADER_TEXT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.4, TEXT_MUTED),
    ]
    for i in range(header_rows, len(data)):
        bg = TABLE_ROW_EVEN if (i - header_rows) % 2 == 0 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

# ━━ Helper: Accent line ━━
class AccentLine(Flowable):
    def __init__(self, width=None, thickness=1.5):
        Flowable.__init__(self)
        self.width = width or CONTENT_W
        self.thickness = thickness
    def wrap(self, availWidth, availHeight):
        return (self.width, self.thickness + 4)
    def draw(self):
        self.canv.setStrokeColor(ACCENT)
        self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 2, self.width * 0.3, 2)

# ━━ TOC DocTemplate ━━
class TocDocTemplate(SimpleDocTemplate):
    def __init__(self, *args, **kwargs):
        SimpleDocTemplate.__init__(self, *args, **kwargs)
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

def add_heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

# ━━ Page Background ━━
def dark_page_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG_PAGE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    # Subtle side accent
    canvas.setFillColor(ACCENT)
    canvas.rect(0, 0, 3, PAGE_H, fill=1, stroke=0)
    # Page number
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont('LiberationSerif', 8)
    canvas.drawRightString(PAGE_W - RIGHT_M, BOT_M - 16, f'{doc.page}')
    canvas.restoreState()

# ━━ Build Document ━━
OUTPUT = '/home/z/my-project/download/ChipNet_Concept_Site.pdf'

doc = TocDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=LEFT_M, rightMargin=RIGHT_M,
    topMargin=TOP_M, bottomMargin=BOT_M,
)

story = []

# ════════════════════════════════════════════════════════
# COVER PAGE
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 120))

cover_title = ParagraphStyle(
    'CoverTitle', fontName='LiberationSerif-Bold', fontSize=38, leading=46,
    textColor=ACCENT, alignment=TA_LEFT, wordWrap='CJK'
)
cover_sub = ParagraphStyle(
    'CoverSub', fontName='LiberationSans-Bold', fontSize=18, leading=24,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, wordWrap='CJK'
)
cover_meta = ParagraphStyle(
    'CoverMeta', fontName='LiberationSerif', fontSize=12, leading=18,
    textColor=TEXT_MUTED, alignment=TA_LEFT, wordWrap='CJK'
)

story.append(AccentLine(width=CONTENT_W, thickness=3))
story.append(Spacer(1, 20))
story.append(Paragraph('<b>ChipNet.ru</b>', cover_title))
story.append(Spacer(1, 8))
story.append(Paragraph('Semiconductor Sourcing Platform', cover_sub))
story.append(Spacer(1, 4))
story.append(Paragraph('Концепция сайта, UX/UI, SEO-архитектура и техническая стратегия', ParagraphStyle(
    'CoverDesc', fontName='LiberationSerif', fontSize=14, leading=20,
    textColor=TEXT_MUTED, alignment=TA_LEFT, wordWrap='CJK'
)))
story.append(Spacer(1, 30))
story.append(AccentLine(width=CONTENT_W*0.5, thickness=1))
story.append(Spacer(1, 30))

# Summary block
summary_style = ParagraphStyle(
    'SummaryBlock', fontName='LiberationSerif', fontSize=11, leading=18,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, wordWrap='CJK',
    leftIndent=12, borderPadding=8
)
story.append(Paragraph(
    'Полная концепция B2B-платформы поставки электронных компонентов, микросхем и BOM-комплектации. '
    'Документ включает структуру сайта, UX/UI-дизайн-систему, SEO-архитектуру, технические требования, '
    'стратегию конверсии, контент-стратегию и component-архитектуру на базе Next.js App Router.',
    summary_style
))

story.append(Spacer(1, 80))
story.append(Paragraph('Version 1.0 / May 2026', cover_meta))
story.append(Paragraph('chip-net.ru', cover_meta))

story.append(PageBreak())

# ════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ════════════════════════════════════════════════════════
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle('TOC1', fontName='LiberationSerif-Bold', fontSize=12, leading=20,
                   leftIndent=20, textColor=ACCENT, spaceBefore=4, spaceAfter=2),
    ParagraphStyle('TOC2', fontName='LiberationSerif', fontSize=10.5, leading=16,
                   leftIndent=40, textColor=TEXT_PRIMARY, spaceBefore=2, spaceAfter=1),
]
story.append(Paragraph('<b>Содержание</b>', ParagraphStyle(
    'TOCTitle', fontName='LiberationSerif-Bold', fontSize=20, leading=26,
    textColor=ACCENT, spaceBefore=8, spaceAfter=16
)))
story.append(toc)
story.append(PageBreak())

# ════════════════════════════════════════════════════════
# 1. ПОЛНАЯ СТРУКТУРА САЙТА
# ════════════════════════════════════════════════════════
story.append(add_heading('<b>1. Полная структура сайта</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Архитектура сайта ChipNet.ru строится вокруг двух ключевых пользовательских сценариев: '
    'поиск и заказ электронных компонентов (сценарий инженера/procurement-менеджера) и '
    'загрузка BOM для комплексной комплектации (сценарий контрактного производства). '
    'Каждая страница имеет чёткую цель в воронке конверсии, SEO-оптимизирована и '
    'связана внутренней перелинковкой в единую экосистему. Структура разделена на '
    'публичные маркетинговые страницы, каталог, транзакционные страницы и контентный раздел.',
    body_justify
))
story.append(Spacer(1, 8))

# Main pages table
site_structure = [
    [Paragraph('<b>Раздел</b>', header_cell_style),
     Paragraph('<b>URL</b>', header_cell_style),
     Paragraph('<b>Назначение</b>', header_cell_style),
     Paragraph('<b>Приоритет</b>', header_cell_style)],

    [Paragraph('Главная', cell_style),
     Paragraph('/', cell_center),
     Paragraph('Входная точка, Hero, поиск, BOM upload, доверие', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('Каталог', cell_style),
     Paragraph('/catalog', cell_center),
     Paragraph('Полный каталог компонентов с фильтрами и поиском', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('Категория', cell_style),
     Paragraph('/category/[slug]', cell_center),
     Paragraph('Программатические SEO-страницы по категориям', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('Бренд', cell_style),
     Paragraph('/brand/[slug]', cell_center),
     Paragraph('Landing-страницы производителей', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('Карточка товара', cell_style),
     Paragraph('/component/[sku]', cell_center),
     Paragraph('Детальная страница компонента, datasheet, аналоги', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('BOM Upload', cell_style),
     Paragraph('/bom', cell_center),
     Paragraph('Загрузка BOM-файла, парсинг, комплектация', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('RFQ / Запрос КП', cell_style),
     Paragraph('/rfq', cell_center),
     Paragraph('Форма запроса коммерческого предложения', cell_style),
     Paragraph('P0', cell_center)],

    [Paragraph('О компании', cell_style),
     Paragraph('/about', cell_center),
     Paragraph('Доверие, экспертиза, certifications, команда', cell_style),
     Paragraph('P1', cell_center)],

    [Paragraph('Отрасли', cell_style),
     Paragraph('/industries', cell_center),
     Paragraph('Сектора: automotive, medical, aerospace и т.д.', cell_style),
     Paragraph('P1', cell_center)],

    [Paragraph('Блог', cell_style),
     Paragraph('/blog', cell_center),
     Paragraph('Экспертный контент, статьи, обзоры', cell_style),
     Paragraph('P1', cell_center)],

    [Paragraph('База знаний', cell_style),
     Paragraph('/knowledge', cell_center),
     Paragraph('Справочники, руководства, glossary', cell_style),
     Paragraph('P2', cell_center)],

    [Paragraph('Поиск аналогов', cell_style),
     Paragraph('/cross-reference', cell_center),
     Paragraph('Cross-reference система поиска аналогов', cell_style),
     Paragraph('P1', cell_center)],

    [Paragraph('Сравнение', cell_style),
     Paragraph('/compare', cell_center),
     Paragraph('Сравнение до 4 компонентов по спецификациям', cell_style),
     Paragraph('P2', cell_center)],

    [Paragraph('Импорт/Экспорт', cell_style),
     Paragraph('/import-export', cell_center),
     Paragraph('Таможенное оформление, логистика, ЭДО', cell_style),
     Paragraph('P1', cell_center)],

    [Paragraph('GEO-страницы', cell_style),
     Paragraph('/geo/[city]', cell_center),
     Paragraph('Локальные landing для регионов РФ', cell_style),
     Paragraph('P2', cell_center)],
]

story.append(Spacer(1, 8))
story.append(dark_table(site_structure, col_widths=[90, 100, 210, 50]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 1. Полная структура страниц ChipNet.ru', caption_style))

# ════════════════════════════════════════════════════════
# 2. UX/UI КОНЦЕПЦИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>2. UX/UI концепция</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>2.1. Визуальная философия</b>', h2_style, 1))
story.append(Paragraph(
    'Визуальная система ChipNet.ru построена на стыке промышленного дизайна и интерфейсов '
    'semiconductor-платформ. Основная метафора: engineering dashboard нового поколения. '
    'Каждый элемент интерфейса транслирует технологическую экспертизу и надёжность. '
    'Тёмная тема доминирует, создавая ощущение рабочего инструмента, а не витрины. '
    'Акцентный цвет (cyan/teal) ассоциируется с цифровыми технологиями, точностью и '
    'современностью, что критически важно для B2B-аудитории, привыкшей к интерфейсам '
    'DigiKey, Mouser и профессиональным EDA-системам.',
    body_justify
))

story.append(add_heading('<b>2.2. Дизайн-принципы</b>', h2_style, 1))

principles = [
    ('Functional First', 'Каждый элемент интерфейса решает конкретную задачу пользователя. '
     'Декоративность минимизирована, функциональность максимизирована. Пользователь должен '
     'найти нужный компонент или отправить BOM за минимальное количество кликов.'),
    ('Engineering Precision', 'Выравнивание, сетка, отступы, типографика подчинены модульной системе. '
     'Это не просто дизайн, а инженерная точность, которую ценит техническая аудитория. '
     'Базовая сетка: 8px, все размеры кратны этому модулю.'),
    ('Trust Through Density', 'Информационная плотность создаёт ощущение экспертности. '
     'Карточки компонентов содержат максимум полезных данных: SKU, статус доступности, '
     'lead time, MOQ, datasheet, аналоги. Пустое пространство используется намеренно, '
     'а не от недостатка контента.'),
    ('Progressive Disclosure', 'Многоуровневая подача информации: на уровне списка показываем '
     'ключевые параметры, на уровне карточки - полную спецификацию, на уровне datasheet - '
     'оригинальную документацию. Пользователь углубляется по необходимости.'),
    ('Dark-First Professional', 'Тёмная тема как основная сигнализирует о профессиональном '
     'инструменте. Светлая тема доступна как опция, но тёмная задает тон. '
     'Это стандарт для EDA-инструментов, oscilloscope-интерфейсов и semiconductor-платформ.'),
]

for title, desc in principles:
    story.append(Paragraph(f'<b>{title}</b>', h3_style))
    story.append(Paragraph(desc, body_justify))

story.append(add_heading('<b>2.3. Цветовая система</b>', h2_style, 1))

color_data = [
    [Paragraph('<b>Роль</b>', header_cell_style),
     Paragraph('<b>Значение</b>', header_cell_style),
     Paragraph('<b>Применение</b>', header_cell_style)],
    [Paragraph('Background Primary', cell_style),
     Paragraph('#050807', cell_center),
     Paragraph('Основной фон страниц', cell_style)],
    [Paragraph('Background Surface', cell_style),
     Paragraph('#111916', cell_center),
     Paragraph('Фон карточек, таблиц, sidebar', cell_style)],
    [Paragraph('Accent Primary', cell_style),
     Paragraph('#10B981', cell_center),
     Paragraph('CTA-кнопки, ссылки, активные элементы', cell_style)],
    [Paragraph('Accent Secondary', cell_style),
     Paragraph('#06B6D4', cell_center),
     Paragraph('Бренд-пилл, бейджи, вторичные акценты', cell_style)],
    [Paragraph('Text Primary', cell_style),
     Paragraph('#F9FAFB', cell_center),
     Paragraph('Основной текст, заголовки', cell_style)],
    [Paragraph('Text Muted', cell_style),
     Paragraph('#9CA3AF', cell_center),
     Paragraph('Метаданные, подписи, placeholder', cell_style)],
    [Paragraph('Border', cell_style),
     Paragraph('#1F2937', cell_center),
     Paragraph('Разделители, рамки карточек', cell_style)],
    [Paragraph('Success', cell_style),
     Paragraph('#22C55E', cell_center),
     Paragraph('Статус In Stock, подтверждение', cell_style)],
    [Paragraph('Warning', cell_style),
     Paragraph('#F59E0B', cell_center),
     Paragraph('Low Stock, Limited Availability', cell_style)],
    [Paragraph('Danger', cell_style),
     Paragraph('#EF4444', cell_center),
     Paragraph('EOL, Obsolete, Out of Stock', cell_style)],
]

story.append(dark_table(color_data, col_widths=[120, 80, 250]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 2. Цветовая система ChipNet.ru', caption_style))

story.append(add_heading('<b>2.4. Типографическая система</b>', h2_style, 1))

typo_data = [
    [Paragraph('<b>Уровень</b>', header_cell_style),
     Paragraph('<b>Размер</b>', header_cell_style),
     Paragraph('<b>Weight</b>', header_cell_style),
     Paragraph('<b>Шрифт</b>', header_cell_style),
     Paragraph('<b>Применение</b>', header_cell_style)],
    [Paragraph('Display', cell_style), Paragraph('48-64px', cell_center),
     Paragraph('Bold', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Hero-заголовки', cell_style)],
    [Paragraph('H1', cell_style), Paragraph('36-40px', cell_center),
     Paragraph('Bold', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Заголовки секций', cell_style)],
    [Paragraph('H2', cell_style), Paragraph('28-32px', cell_center),
     Paragraph('Semibold', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Подзаголовки', cell_style)],
    [Paragraph('H3', cell_style), Paragraph('20-24px', cell_center),
     Paragraph('Semibold', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Заголовки блоков', cell_style)],
    [Paragraph('Body', cell_style), Paragraph('16px', cell_center),
     Paragraph('Regular', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Основной текст', cell_style)],
    [Paragraph('Mono', cell_style), Paragraph('14-16px', cell_center),
     Paragraph('Regular', cell_center), Paragraph('JetBrains Mono', cell_center),
     Paragraph('SKU, part numbers, specs', cell_style)],
    [Paragraph('Caption', cell_style), Paragraph('12-14px', cell_center),
     Paragraph('Regular', cell_center), Paragraph('Inter', cell_center),
     Paragraph('Метаданные, бейджи', cell_style)],
]

story.append(dark_table(typo_data, col_widths=[70, 70, 65, 90, 155]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 3. Типографическая система', caption_style))

# ════════════════════════════════════════════════════════
# 3. ГЛАВНАЯ СТРАНИЦА
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>3. Главная страница</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>3.1. Hero Section</b>', h2_style, 1))
story.append(Paragraph(
    'Hero-секция является критическим конверсионным элементом и должна мгновенно коммуницировать '
    'ценностное предложение для трёх типов аудитории: инженера, ищущего конкретный компонент; '
    'procurement-менеджера, загружающего BOM; и руководителя, оценивающего надёжность поставщика. '
    'Композиция строится по принципу inverted-L: слева текстовый блок с headline и CTA, '
    'справа - интегрированная поисковая панель с BOM-upload зоной.',
    body_justify
))

story.append(Paragraph('<b>Headline:</b> Electronic Components. Global Sourcing. Certified Supply.', h3_style))
story.append(Paragraph(
    'Подзаголовок транслирует ключевое преимущество: доступ к более чем 10 миллионам наименований '
    'от сертифицированных производителей с гарантией подлинности и лабораторной проверкой качества. '
    'Формулировка ориентирована на техническую аудиторию и избегает маркетинговых клише. '
    'Два основных CTA-элемента: строка поиска по part number (с автодополнением и поддержкой '
    'wildcard-поиска) и кнопка загрузки BOM-файла (поддержка Excel, CSV, PDF форматов).',
    body_justify
))

hero_elements = [
    [Paragraph('<b>Элемент</b>', header_cell_style),
     Paragraph('<b>Описание</b>', header_cell_style),
     Paragraph('<b>Конверсионная роль</b>', header_cell_style)],
    [Paragraph('Поиск по part number', cell_style),
     Paragraph('Строка поиска 100% ширины с autocomplete, поддержкой wildcard и fuzzy search', cell_style),
     Paragraph('Основной путь: поиск -> карточка -> RFQ', cell_style)],
    [Paragraph('BOM Upload Zone', cell_style),
     Paragraph('Drag-and-drop зона для загрузки BOM-файлов (XLS/CSV/PDF)', cell_style),
     Paragraph('Альтернативный путь: загрузка -> парсинг -> КП', cell_style)],
    [Paragraph('CTA "Запросить КП"', cell_style),
     Paragraph('Кнопка с эмerald-фоном, ведёт на RFQ-форму', cell_style),
     Paragraph('Прямая конверсия для горячих лидов', cell_style)],
    [Paragraph('Trusted By метрика', cell_style),
     Paragraph('Счётчики: 2600+ SKU, 70+ брендов, 500+ клиентов', cell_style),
     Paragraph('Social proof, мгновенное доверие', cell_style)],
]

story.append(dark_table(hero_elements, col_widths=[120, 200, 130]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 4. Элементы Hero-секции', caption_style))

story.append(add_heading('<b>3.2. Секции главной страницы</b>', h2_style, 1))

sections_data = [
    [Paragraph('<b>Секция</b>', header_cell_style),
     Paragraph('<b>Контент</b>', header_cell_style),
     Paragraph('<b>UX-цель</b>', header_cell_style)],
    [Paragraph('Trusted Brands', cell_style),
     Paragraph('Бесконечный marquee-карусель SVG-логотипов производителей', cell_style),
     Paragraph('Ассоциация с мировыми брендами, доверие', cell_style)],
    [Paragraph('Popular Categories', cell_style),
     Paragraph('Grid из 10 категорий с иконками и счётчиками', cell_style),
     Paragraph('Навигация в каталог, SEO-кластеры', cell_style)],
    [Paragraph('Advantages', cell_style),
     Paragraph('6 преимуществ: Anti-counterfeit, Lab test, Express, BOM, Global, 24/7', cell_style),
     Paragraph('Дифференциация от конкурентов', cell_style)],
    [Paragraph('Supply Geography', cell_style),
     Paragraph('Интерактивная карта с маршрутами поставок', cell_style),
     Paragraph('Масштабность, глобальный охват', cell_style)],
    [Paragraph('Anti-Counterfeit', cell_style),
     Paragraph('Блок о проверке в СВП-лаборатории, сертификаты', cell_style),
     Paragraph('Критический trust-фактор для санкционных компонентов', cell_style)],
    [Paragraph('Workflow', cell_style),
     Paragraph('4 шага: Запрос -> Проверка -> Поставка -> Гарантия', cell_style),
     Paragraph('Прозрачность процесса, снижение барьера', cell_style)],
    [Paragraph('Industries', cell_style),
     Paragraph('8 отраслей с иконками и кратким описанием', cell_style),
     Paragraph('Self-identification, отраслевой SEO', cell_style)],
    [Paragraph('Certifications', cell_style),
     Paragraph('Логотипы ISO, СВП, членства в ассоциациях', cell_style),
     Paragraph('EEAT, формальный trust-сигнал', cell_style)],
    [Paragraph('FAQ', cell_style),
     Paragraph('8-12 вопросов с раскрывающимися ответами', cell_style),
     Paragraph('Снятие возражений, SEO-featured snippets', cell_style)],
    [Paragraph('Blog Preview', cell_style),
     Paragraph('3 последние статьи с превью', cell_style),
     Paragraph('Демонстрация экспертизы, контентный маркетинг', cell_style)],
    [Paragraph('CTA Section', cell_style),
     Paragraph('Финальный призыв: BOM upload + RFQ + контакты', cell_style),
     Paragraph('Конверсия для scrolled-пользователей', cell_style)],
]

story.append(dark_table(sections_data, col_widths=[100, 210, 140]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 5. Секции главной страницы', caption_style))

# ════════════════════════════════════════════════════════
# 4. UI БЛОКИ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>4. UI-блоки и компоненты</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Каждый UI-блок спроектирован как автономный компонент с чётким контрактом: входные данные, '
    'состояния (loading, empty, error, success) и конверсионная цель. Компоненты разделены на '
    'три категории: навигационные (помогают найти), информационные (помогают решить) и '
    'транзакционные (помогают купить/заказать).',
    body_justify
))

story.append(add_heading('<b>4.1. Search Component</b>', h2_style, 1))
story.append(Paragraph(
    'Глобальный поиск - ключевой элемент платформы. Поддерживает поиск по part number (точный и '
    'wildcard), по названию компонента (fuzzy), по бренду (с автодополнением), по категории '
    'и по ключевым словам в описании. Результаты отображаются в выпадающем dropdown с разбивкой '
    'по типу: точные совпадения (Exact Match), аналоги (Cross-Reference), категории. '
    'Каждый результат содержит: SKU (моноширинный), краткое название, бренд, статус доступности '
    '(цветной бейдж), цену (при наличии) и ссылку на datasheet. Поиск работает с debounce 300ms, '
    'поддерживает клавиатурную навигацию (стрелки + Enter) и remembers recent queries.',
    body_justify
))

story.append(add_heading('<b>4.2. Upload BOM</b>', h2_style, 1))
story.append(Paragraph(
    'BOM-upload компонент поддерживает drag-and-drop и click-to-upload для файлов форматов '
    'XLS, XLSX, CSV и PDF. После загрузки файла запускается серверный парсинг: извлечение '
    'part numbers, quantities, reference designators. Результат парсинга отображается в '
    'редактируемой таблице: каждая строка - компонент с полями Part Number, Qty, Description, '
    'Status (Found / Alternative / Not Found). Пользователь может отредактировать quantities, '
    'выбрать альтернативы из предложенных и отправить BOM на расчёт коммерческого предложения. '
    'Кнопка "Отправить на расчёт" является основным CTA данного компонента.',
    body_justify
))

story.append(add_heading('<b>4.3. Request Quote (RFQ)</b>', h2_style, 1))
story.append(Paragraph(
    'Форма запроса коммерческого предложения оптимизирована для минимизации полей при '
    'максимальной информативности. Обязательные поля: Part Number (или список), Quantity, '
    'Email, Phone. Опциональные: Company Name, Target Price, Delivery City, Comment. '
    'Форма поддерживает два режима: single-component RFQ (из карточки товара, поля предзаполнены) '
    'и multi-component RFQ (с возможностью добавления нескольких позиций). После отправки '
    'пользователь получает подтверждение с номером заявки и ориентировочным временем ответа. '
    'Интеграция с CRM для автоматического создания deal.',
    body_justify
))

story.append(add_heading('<b>4.4. Compare Parts</b>', h2_style, 1))
story.append(Paragraph(
    'Компонент сравнения позволяет выбрать до 4 компонентов и отобразить их спецификации '
    'в единой таблице. Строки таблицы - параметры (Category, Package, Voltage, Frequency, '
    'Memory, Interfaces и т.д.), столбцы - сравниваемые компоненты. Подсветка различающихся '
    'значений через background-color. Поддержка добавления/удаления компонентов, permalink '
    'для sharing сравнения. CTA: "Request Quote for Selected" с чекбоксами выбора.',
    body_justify
))

story.append(add_heading('<b>4.5. Availability Status, Lead Time, MOQ</b>', h2_style, 1))

status_data = [
    [Paragraph('<b>Статус</b>', header_cell_style),
     Paragraph('<b>Бейдж</b>', header_cell_style),
     Paragraph('<b>Цвет</b>', header_cell_style),
     Paragraph('<b>Поведение</b>', header_cell_style)],
    [Paragraph('In Stock', cell_style),
     Paragraph('В наличии', cell_center),
     Paragraph('Green', cell_center),
     Paragraph('Отображение qty, немедленный RFQ', cell_style)],
    [Paragraph('Low Stock', cell_style),
     Paragraph('Мало на складе', cell_center),
     Paragraph('Yellow', cell_center),
     Paragraph('Отображение остатка, urgency-CTA', cell_style)],
    [Paragraph('On Order', cell_style),
     Paragraph('Под заказ', cell_center),
     Paragraph('Blue', cell_center),
     Paragraph('Lead time в днях, предзаказ', cell_style)],
    [Paragraph('EOL', cell_style),
     Paragraph('Снято с производства', cell_center),
     Paragraph('Red', cell_center),
     Paragraph('Показ аналогов, last-time-buy', cell_style)],
    [Paragraph('Obsolete', cell_style),
     Paragraph('Устаревший', cell_center),
     Paragraph('Gray', cell_center),
     Paragraph('Cross-reference на замену', cell_style)],
]

story.append(dark_table(status_data, col_widths=[80, 110, 60, 200]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 6. Система статусов доступности', caption_style))

story.append(Paragraph(
    'Lead Time отображается как числовое значение в рабочих днях с визуальной шкалой: '
    '1-7 дней (зелёный), 8-30 дней (жёлтый), 31-90 дней (оранжевый), 90+ дней (красный). '
    'MOQ (Minimum Order Quantity) показан в карточке товара рядом с ценой и доступен для '
    'фильтрации в каталоге. Для B2B-клиентов MOQ часто является критическим фактором принятия '
    'решения, поэтому информация должна быть видна на уровне списка каталога.',
    body_justify
))

story.append(add_heading('<b>4.6. Cross-Reference / Alternative Parts</b>', h2_style, 1))
story.append(Paragraph(
    'Система cross-reference является ключевым дифференциатором ChipNet.ru. Для каждого '
    'компонента отображается блок "Аналоги и замены" с подразделами: прямые аналоги (pin-to-pin '
    'compatible), функциональные аналоги (similar specs), аналоги от других брендов. '
    'Каждый аналог содержит: Part Number, Brand, совместимость (% match), статус доступности, '
    'кнопку "Request Quote". Система критически важна для компонентов под санкциями или EOL, '
    'когда оригинал недоступен и инженеру нужна сертифицированная замена.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 5. SEO АРХИТЕКТУРА
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>5. SEO-архитектура</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>5.1. Semantic SEO</b>', h2_style, 1))
story.append(Paragraph(
    'Семантическое SEO строится на entity-based подходе: каждый компонент, бренд и категория '
    'являются сущностями с уникальными страницами, структурированными данными (JSON-LD) и '
    'внутренней связностью. Schema.org типы: Product (для компонентов), Organization (для бренда), '
    'BreadcrumbList (для навигации), FAQPage (для FAQ-секций), Article (для блога). '
    'Каждая страница содержит все обязательные Schema-поля: name, description, image, offers, '
    'availability, brand, sku, manufacturer. Это обеспечивает rich snippets в поисковой выдаче '
    'и корректную индексацию AI-поисковыми системами (Perplexity, SearchGPT).',
    body_justify
))

story.append(add_heading('<b>5.2. Programmatic SEO</b>', h2_style, 1))
story.append(Paragraph(
    'Программатические страницы генерируются автоматически на основе данных из базы компонентов. '
    'Основные типы программатических страниц: категории (30+ страниц), бренды (70+ страниц), '
    'карточки компонентов (2600+ страниц), cross-reference (для каждого EOL/Obsolete компонента), '
    'geo-страницы (15+ городов), отраслевые страницы (8+ индустрий). Общий потенциал: '
    '2800+ автоматически генерируемых SEO-оптимизированных страниц с уникальным контентом, '
    'метаданными и внутренней перелинковкой. Каждая программатическая страница имеет уникальный '
    'Title, Description, H1 и текстовый контент, сгенерированный на основе шаблонов с подстановкой '
    'данных из базы.',
    body_justify
))

story.append(add_heading('<b>5.3. AI SEO / LLM Optimization</b>', h2_style, 1))
story.append(Paragraph(
    'Оптимизация для AI-поиска требует специфического подхода: структурированные данные в формате, '
    'понятном LLM; чёткие ответы на FAQ-вопросы; маркированные списки спецификаций; '
    'таблицы сравнений; фактчекинг-блоки. Каждая карточка компонента содержит секцию '
    '"Quick Facts" с ключевыми параметрами в формате key-value, что облегчает извлечение '
    'информации AI-агентами. Блог-статьи оптимизируются для featured snippets: прямые ответы '
    'на вопросы в первых абзацах, маркированные списки, таблицы. JSON-LD расширен полями '
    'mainEntity, about, mentions для лучшего понимания контекста LLM-моделями.',
    body_justify
))

story.append(add_heading('<b>5.4. Faceted Navigation SEO</b>', h2_style, 1))
story.append(Paragraph(
    'Каталог с фильтрами по категориям, брендам, статусу, типу корпуса создает потенциально '
    'миллионы комбинаций URL. Стратегия: индексируем только основные фильтры (category + brand), '
    'все остальные комбинации закрываем через robots meta noindex, canonical на базовую страницу. '
    'Пагинация: rel=prev/next, canonical на первую страницу. Sort-параметры закрываем через '
    'robots.txt правило. Это предотвращает дублирование контента и концентрирует link juice '
    'на индексируемых страницах.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 6. СТРУКТУРА КАТАЛОГА
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>6. Структура каталога</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Каталог является ядром платформы и строится по иерархическому принципу: '
    'Top-level категории (10 основных групп) -> Sub-категории (30+ подкатегорий) -> '
    'Карточки компонентов (2600+ наименований). Каждая уровень имеет собственную SEO-страницу '
    'с уникальным контентом, хлебными крошками и внутренней перелинковкой.',
    body_justify
))

catalog_data = [
    [Paragraph('<b>Категория</b>', header_cell_style),
     Paragraph('<b>Slug</b>', header_cell_style),
     Paragraph('<b>Подкатегории</b>', header_cell_style),
     Paragraph('<b>Ключевые бренды</b>', header_cell_style)],

    [Paragraph('Microcontrollers', cell_style),
     Paragraph('microcontrollers', cell_center),
     Paragraph('ARM, RISC-V, 8-bit, 32-bit, DSP', cell_style),
     Paragraph('STMicro, NXP, Microchip, Renesas, TI', cell_style)],

    [Paragraph('FPGA / CPLD', cell_style),
     Paragraph('fpga', cell_center),
     Paragraph('FPGA, CPLD, SoC FPGA, Development Boards', cell_style),
     Paragraph('Xilinx/AMD, Altera/Intel, Lattice, Microchip', cell_style)],

    [Paragraph('Power Management', cell_style),
     Paragraph('power-management', cell_center),
     Paragraph('DC/DC, LDO, PMIC, LED Drivers, Battery', cell_style),
     Paragraph('TI, Analog Devices, Infineon, Monolithic Power', cell_style)],

    [Paragraph('Sensors', cell_style),
     Paragraph('sensors', cell_center),
     Paragraph('Temperature, Pressure, IMU, Proximity, Gas', cell_style),
     Paragraph('Bosch, STMicro, TE Connectivity, Honeywell', cell_style)],

    [Paragraph('Memory', cell_style),
     Paragraph('memory', cell_center),
     Paragraph('DRAM, SRAM, Flash, EEPROM, MRAM', cell_style),
     Paragraph('Micron, Samsung, ISSI, Winbond, Cypress', cell_style)],

    [Paragraph('RF / Wireless', cell_style),
     Paragraph('rf-wireless', cell_center),
     Paragraph('Transceivers, RF Amps, Antennas, Modules', cell_style),
     Paragraph('Qualcomm, Nordic, Silicon Labs, u-blox', cell_style)],

    [Paragraph('Analog ICs', cell_style),
     Paragraph('analog-ics', cell_center),
     Paragraph('Op-Amps, ADC/DAC, Comparators, References', cell_style),
     Paragraph('TI, Analog Devices, Maxim, Linear Tech', cell_style)],

    [Paragraph('Passive Components', cell_style),
     Paragraph('passive', cell_center),
     Paragraph('Resistors, Capacitors, Inductors, Crystals', cell_style),
     Paragraph('Murata, TDK, Yageo, Vishay, KOA', cell_style)],

    [Paragraph('Connectors', cell_style),
     Paragraph('connectors', cell_center),
     Paragraph('Board-to-Board, FPC, USB, HDMI, RF', cell_style),
     Paragraph('TE, Molex, Amphenol, Hirose, JST', cell_style)],

    [Paragraph('Embedded Solutions', cell_style),
     Paragraph('embedded', cell_center),
     Paragraph('SBC, SoM, Modules, Dev Kits, Debuggers', cell_style),
     Paragraph('NVIDIA, NXP, Raspberry Pi, Arduino', cell_style)],
]

story.append(dark_table(catalog_data, col_widths=[90, 85, 145, 130]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 7. Структура каталога компонентов', caption_style))

# ════════════════════════════════════════════════════════
# 7. SEO ДЛЯ КАЖДОЙ СТРАНИЦЫ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>7. SEO для каждой страницы</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>7.1. Title / Meta / Schema стратегия</b>', h2_style, 1))

seo_data = [
    [Paragraph('<b>Страница</b>', header_cell_style),
     Paragraph('<b>Title Pattern</b>', header_cell_style),
     Paragraph('<b>Schema</b>', header_cell_style)],

    [Paragraph('Главная', cell_style),
     Paragraph('ChipNet - Electronic Components Sourcing | BOM Supply', cell_style),
     Paragraph('Organization + WebSite + SearchAction', cell_style)],

    [Paragraph('Каталог', cell_style),
     Paragraph('Каталог электронных компонентов | ChipNet', cell_style),
     Paragraph('ItemList + BreadcrumbList', cell_style)],

    [Paragraph('Категория', cell_style),
     Paragraph('{Category} - купить {cat_acc} | ChipNet', cell_style),
     Paragraph('CollectionPage + ItemList', cell_style)],

    [Paragraph('Бренд', cell_style),
     Paragraph('{Brand} компоненты - официальный поставщик | ChipNet', cell_style),
     Paragraph('Brand + Organization + ItemList', cell_style)],

    [Paragraph('Карточка', cell_style),
     Paragraph('{SKU} - {Name} | Datasheet, Price, Stock | ChipNet', cell_style),
     Paragraph('Product + Offer + Availability', cell_style)],

    [Paragraph('BOM Upload', cell_style),
     Paragraph('BOM-комплектация электронных компонентов | ChipNet', cell_style),
     Paragraph('WebPage + HowTo', cell_style)],

    [Paragraph('RFQ', cell_style),
     Paragraph('Запрос коммерческого предложения | ChipNet', cell_style),
     Paragraph('WebPage + ContactPage', cell_style)],

    [Paragraph('Блог', cell_style),
     Paragraph('{Title} | ChipNet Blog', cell_style),
     Paragraph('Article + Author + Publisher', cell_style)],

    [Paragraph('Cross-Ref', cell_style),
     Paragraph('Аналог {SKU} - кросс-референс замена | ChipNet', cell_style),
     Paragraph('Product + isSimilarTo', cell_style)],
]

story.append(dark_table(seo_data, col_widths=[80, 210, 160]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 8. SEO-стратегия по типам страниц', caption_style))

story.append(add_heading('<b>7.2. Internal Linking Map</b>', h2_style, 1))
story.append(Paragraph(
    'Внутренняя перелинковка строится по hub-spoke модели: hub-страницы (главная, каталог, '
    'категории, бренды) связывают spoke-страницы (карточки компонентов, cross-reference). '
    'Каждая карточка компонента содержит: ссылку на категорию, ссылку на бренд, ссылки на '
    'аналоги (3-5 шт.), ссылку на связанный блог-пост (при наличии). Каждая категория '
    'ссылается на бренды, представленные в ней. Каждый бренд ссылается на свои топ-категории. '
    'Блог-статьи содержат контекстные ссылки на карточки компонентов и категории. '
    'Это создаёт плотную сеть внутренних связей, распределяющую link juice и помогающую '
    'поисковым роботам обнаружить все страницы.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 8. ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>8. Технические требования</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>8.1. Стек технологий</b>', h2_style, 1))

tech_data = [
    [Paragraph('<b>Слой</b>', header_cell_style),
     Paragraph('<b>Технология</b>', header_cell_style),
     Paragraph('<b>Обоснование</b>', header_cell_style)],

    [Paragraph('Framework', cell_style),
     Paragraph('Next.js 16 App Router', cell_center),
     Paragraph('SSR/ISR, SEO-first, React Server Components', cell_style)],

    [Paragraph('Language', cell_style),
     Paragraph('TypeScript (strict mode)', cell_center),
     Paragraph('Type safety, DX, enterprise-grade', cell_style)],

    [Paragraph('Styling', cell_style),
     Paragraph('Tailwind CSS 4', cell_center),
     Paragraph('Utility-first, dark mode, performance', cell_style)],

    [Paragraph('Database', cell_style),
     Paragraph('Supabase (PostgreSQL)', cell_center),
     Paragraph('Realtime, RLS, CDN, free tier sufficient', cell_style)],

    [Paragraph('State', cell_style),
     Paragraph('URL search params + React hooks', cell_center),
     Paragraph('Shareable URLs, SSR-friendly', cell_style)],

    [Paragraph('Search', cell_style),
     Paragraph('Supabase full-text + ilike', cell_center),
     Paragraph('MVP-ready, upgrade to Meilisearch later', cell_style)],

    [Paragraph('Deployment', cell_style),
     Paragraph('PM2 + Nginx + Ubuntu VPS', cell_center),
     Paragraph('Cost-effective, full control, SSR', cell_style)],

    [Paragraph('Analytics', cell_style),
     Paragraph('Yandex Metrika + custom events', cell_center),
     Paragraph('Conversion tracking, user behavior', cell_style)],

    [Paragraph('Monitoring', cell_style),
     Paragraph('Sentry (error) + UptimeRobot', cell_center),
     Paragraph('Production reliability, alerting', cell_style)],
]

story.append(dark_table(tech_data, col_widths=[80, 140, 230]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 9. Стек технологий', caption_style))

story.append(add_heading('<b>8.2. Core Web Vitals цели</b>', h2_style, 1))

vitals_data = [
    [Paragraph('<b>Метрика</b>', header_cell_style),
     Paragraph('<b>Цель</b>', header_cell_style),
     Paragraph('<b>Метод достижения</b>', header_cell_style)],

    [Paragraph('LCP (Largest Contentful Paint)', cell_style),
     Paragraph('< 2.5s', cell_center),
     Paragraph('SSR, оптимизация изображений, preload critical resources', cell_style)],

    [Paragraph('FID (First Input Delay)', cell_style),
     Paragraph('< 100ms', cell_center),
     Paragraph('Minimal client JS, code splitting, lazy hydration', cell_style)],

    [Paragraph('CLS (Cumulative Layout Shift)', cell_style),
     Paragraph('< 0.1', cell_center),
     Paragraph('Explicit dimensions, font-display:swap, skeleton loaders', cell_style)],

    [Paragraph('INP (Interaction to Next Paint)', cell_style),
     Paragraph('< 200ms', cell_center),
     Paragraph('useTransition, optimistic updates, minimal re-renders', cell_style)],

    [Paragraph('TTFB (Time to First Byte)', cell_style),
     Paragraph('< 800ms', cell_center),
     Paragraph('Edge caching, ISR revalidation, connection pooling', cell_style)],
]

story.append(dark_table(vitals_data, col_widths=[160, 60, 230]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 10. Core Web Vitals', caption_style))

story.append(add_heading('<b>8.3. Архитектура Next.js</b>', h2_style, 1))
story.append(Paragraph(
    'Проект использует App Router с чётким разделением на Server Components (по умолчанию) '
    'и Client Components (только для интерактивности). Страницы каталога, категорий и брендов '
    'являются серверными компонентами с ISR (revalidate: 3600). Карточки компонентов генерируются '
    'по требованию (dynamic rendering) с кэшированием на уровне Nginx. Динамические metadata '
    'генерируются через generateMetadata() для каждой страницы. JSON-LD внедряется через '
    'Server Component JsonLd, который рендерит script type application/ld+json. '
    'BOM-upload и RFQ-формы являются Client Components с server actions для обработки данных. '
    'Sitemap генерируется динамически через app/sitemap.ts с актуальными данными из Supabase.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 9. TRUST / EEAT АРХИТЕКТУРА
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>9. Trust-архитектура и EEAT</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Trust-архитектура ChipNet.ru строится на принципе "Доверие через доказательства, '
    'а не утверждения". Каждый блок доверия подкреплён конкретными фактами: сертификатами, '
    'лабораторными отчётами, числами, кейсами. EEAT-стратегия (Experience, Expertise, '
    'Authoritativeness, Trustworthiness) реализована на всех уровнях сайта.',
    body_justify
))

trust_data = [
    [Paragraph('<b>EEAT Сигнал</b>', header_cell_style),
     Paragraph('<b>Реализация на сайте</b>', header_cell_style),
     Paragraph('<b>Расположение</b>', header_cell_style)],

    [Paragraph('Experience', cell_style),
     Paragraph('Кейсы проектов, отзывы клиентов, статистика поставок', cell_style),
     Paragraph('Главная, About, Industries', cell_style)],

    [Paragraph('Expertise', cell_style),
     Paragraph('Блог с техническими статьями, базы знаний, datasheets', cell_style),
     Paragraph('Blog, Knowledge Base, Card Pages', cell_style)],

    [Paragraph('Authoritativeness', cell_style),
     Paragraph('Сертификаты СВП, ISO, членства, партнёрства', cell_style),
     Paragraph('About, Certifications Section', cell_style)],

    [Paragraph('Trustworthiness', cell_style),
     Paragraph('Anti-counterfeit блок, lab testing, гарантии, SSL', cell_style),
     Paragraph('Hero, About, Footer', cell_style)],

    [Paragraph('Anti-Counterfeit', cell_style),
     Paragraph('Отдельная секция: лаборатория СВП, X-ray, Decap,电气 testing', cell_style),
     Paragraph('Главная, About, Card Pages', cell_style)],

    [Paragraph('Quality Assurance', cell_style),
     Paragraph('3-уровневая проверка: визуальная, электрическая, рентген', cell_style),
     Paragraph('About, Workflow Section', cell_style)],

    [Paragraph('Supply Chain', cell_style),
     Paragraph('Прямые контракты с производителями, авторизованные дистрибьюторы', cell_style),
     Paragraph('About, Brand Pages', cell_style)],
]

story.append(dark_table(trust_data, col_widths=[100, 220, 130]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 11. EEAT-архитектура', caption_style))

# ════════════════════════════════════════════════════════
# 10. SITEMAP / URL СТРАТЕГИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>10. Sitemap и URL-стратегия</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>10.1. URL-паттерны</b>', h2_style, 1))

url_data = [
    [Paragraph('<b>Тип страницы</b>', header_cell_style),
     Paragraph('<b>URL Pattern</b>', header_cell_style),
     Paragraph('<b>Пример</b>', header_cell_style)],

    [Paragraph('Главная', cell_style),
     Paragraph('/', cell_center),
     Paragraph('https://www.chip-net.ru/', cell_style)],

    [Paragraph('Каталог', cell_style),
     Paragraph('/catalog', cell_center),
     Paragraph('https://www.chip-net.ru/catalog', cell_style)],

    [Paragraph('Категория', cell_style),
     Paragraph('/category/{slug}', cell_center),
     Paragraph('https://www.chip-net.ru/category/microcontrollers', cell_style)],

    [Paragraph('Бренд', cell_style),
     Paragraph('/brand/{slug}', cell_center),
     Paragraph('https://www.chip-net.ru/brand/stmicroelectronics', cell_style)],

    [Paragraph('Компонент', cell_style),
     Paragraph('/component/{sku}', cell_center),
     Paragraph('https://www.chip-net.ru/component/STM32F103C8T6', cell_style)],

    [Paragraph('Cross-Ref', cell_style),
     Paragraph('/cross-reference/{sku}', cell_center),
     Paragraph('https://www.chip-net.ru/cross-reference/STM32F103C8T6', cell_style)],

    [Paragraph('BOM', cell_style),
     Paragraph('/bom', cell_center),
     Paragraph('https://www.chip-net.ru/bom', cell_style)],

    [Paragraph('RFQ', cell_style),
     Paragraph('/rfq', cell_center),
     Paragraph('https://www.chip-net.ru/rfq', cell_style)],

    [Paragraph('Блог', cell_style),
     Paragraph('/blog/{slug}', cell_center),
     Paragraph('https://www.chip-net.ru/blog/stm32-vs-esp32', cell_style)],

    [Paragraph('GEO', cell_style),
     Paragraph('/geo/{city}', cell_center),
     Paragraph('https://www.chip-net.ru/geo/moskva', cell_style)],
]

story.append(dark_table(url_data, col_widths=[90, 120, 240]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 12. URL-паттерны', caption_style))

story.append(add_heading('<b>10.2. Sitemap структура</b>', h2_style, 1))
story.append(Paragraph(
    'Sitemap генерируется динамически через app/sitemap.ts и включает все индексируемые '
    'страницы. Расчётное количество URL в sitemap: статические страницы (10) + категории (30) + '
    'бренды (70) + компоненты (2600) + блог (20) + GEO (15) + industries (8) = примерно 2753 URL. '
    'При превышении лимита 50,000 URL sitemap разбивается на индексный файл с вложенными sitemap. '
    'Каждый URL содержит: loc, lastmod (дата обновления из Supabase), changefreq (weekly для '
    'каталога, daily для главной), priority (1.0 для главной, 0.8 для категорий/брендов, '
    '0.6 для карточек). Sitemap доступен по адресу https://www.chip-net.ru/sitemap.xml.',
    body_justify
))

story.append(add_heading('<b>10.3. Breadcrumbs</b>', h2_style, 1))
story.append(Paragraph(
    'Хлебные крошки реализованы на всех страницах через BreadcrumbList schema и визуальный '
    'компонент. Пример для карточки компонента: Главная > Каталог > Microcontrollers > '
    'STM32F103C8T6. Для бренд-страницы: Главная > Бренды > STMicroelectronics. '
    'Breadcrumbs являются кликабельными ссылками и обеспечивают как навигацию, так и SEO-value '
    'через структурированные данные. Реализация через Server Component с генерацией пути '
    'на основе URL и данных из Supabase.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 11. ДИЗАЙН-СИСТЕМА
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>11. Дизайн-система</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>11.1. Компонентная архитектура</b>', h2_style, 1))

comp_data = [
    [Paragraph('<b>Компонент</b>', header_cell_style),
     Paragraph('<b>Тип</b>', header_cell_style),
     Paragraph('<b>Вариации</b>', header_cell_style)],

    [Paragraph('Button', cell_style),
     Paragraph('UI', cell_center),
     Paragraph('Primary (emerald), Secondary (outline), Ghost, Danger, Sizes: sm/md/lg', cell_style)],

    [Paragraph('Input', cell_style),
     Paragraph('UI', cell_center),
     Paragraph('Text, Search, File Upload, Select, с icon prefix/suffix', cell_style)],

    [Paragraph('Badge', cell_style),
     Paragraph('UI', cell_center),
     Paragraph('Status (In Stock/EOL/Low), Category, Brand, Count', cell_style)],

    [Paragraph('Card', cell_style),
     Paragraph('Layout', cell_center),
     Paragraph('Component Card, Category Card, Brand Card, Blog Card', cell_style)],

    [Paragraph('Table', cell_style),
     Paragraph('Data', cell_center),
     Paragraph('Specs Table, Compare Table, BOM Table, Price Table', cell_style)],

    [Paragraph('SearchBar', cell_style),
     Paragraph('Feature', cell_center),
     Paragraph('Global Search, Category Filtered, BOM Search', cell_style)],

    [Paragraph('FilterSidebar', cell_style),
     Paragraph('Feature', cell_center),
     Paragraph('Desktop inline, Mobile drawer, Tablet overlay', cell_style)],

    [Paragraph('Pagination', cell_style),
     Paragraph('Navigation', cell_center),
     Paragraph('Numbered, Infinite scroll (optional), Load More', cell_style)],

    [Paragraph('Breadcrumbs', cell_style),
     Paragraph('Navigation', cell_center),
     Paragraph('Standard, Schema-annotated, Truncated on mobile', cell_style)],

    [Paragraph('JsonLd', cell_style),
     Paragraph('SEO', cell_center),
     Paragraph('Product, Organization, BreadcrumbList, FAQPage, Article', cell_style)],
]

story.append(dark_table(comp_data, col_widths=[100, 50, 300]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 13. Компонентная архитектура дизайн-системы', caption_style))

story.append(add_heading('<b>11.2. Grid система и адаптивность</b>', h2_style, 1))
story.append(Paragraph(
    'Базовая сетка: 12 колонок с gap 24px. Контентная область: max-width 1280px (7xl), '
    'центрированная с auto-margins. Breakpoints: sm (640px), md (768px), lg (1024px), '
    'xl (1280px), 2xl (1536px). Каталог: sidebar (w-64) + content (flex-1), на мобильных '
    'sidebar скрывается в drawer. Карточки компонентов: grid-cols-1 -> sm:2 -> lg:3. '
    'Все компоненты используют Tailwind responsive utilities, mobile-first подход. '
    'Сетка каталога адаптируется: с открытым фильтром 3 колонки, без фильтра - 3 колонки '
    'на lg+, 2 на sm+.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 12. КОНВЕРСИОННАЯ СТРАТЕГИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>12. Конверсионная стратегия</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Основная конверсионная цель ChipNet.ru - получение B2B-заявок на поставку компонентов '
    'и BOM-комплектацию. Воронка конверсии строится по трём основным путям, каждый из которых '
    'оптимизирован для своего типа пользователя и сценария использования. Ключевой принцип: '
    'минимизировать трение на каждом шаге, предоставить несколько точек входа в воронку и '
    'обеспечить многократные CTA-точки на каждой странице.',
    body_justify
))

story.append(add_heading('<b>12.1. Воронки конверсии</b>', h2_style, 1))

funnel_data = [
    [Paragraph('<b>Путь</b>', header_cell_style),
     Paragraph('<b>Шаги</b>', header_cell_style),
     Paragraph('<b>CTA на каждом шаге</b>', header_cell_style)],

    [Paragraph('Search -> RFQ', cell_style),
     Paragraph('Поиск -> Карточка -> RFQ -> Подтверждение', cell_style),
     Paragraph('"Найти" -> "Запросить КП" -> "Отправить" -> "Спасибо"', cell_style)],

    [Paragraph('BOM Upload -> Quote', cell_style),
     Paragraph('Загрузка BOM -> Парсинг -> Проверка -> Отправка', cell_style),
     Paragraph('"Загрузить BOM" -> "Проверить" -> "Отправить на расчёт"', cell_style)],

    [Paragraph('Catalog -> RFQ', cell_style),
     Paragraph('Каталог -> Фильтр -> Карточка -> RFQ', cell_style),
     Paragraph('"Фильтры" -> "Выбрать" -> "Запросить КП"', cell_style)],

    [Paragraph('Brand -> RFQ', cell_style),
     Paragraph('Бренд-страница -> Компонент -> RFQ', cell_style),
     Paragraph('"Смотреть каталог" -> "Запросить КП"', cell_style)],

    [Paragraph('Blog -> RFQ', cell_style),
     Paragraph('Статья -> Упоминание компонента -> Карточка -> RFQ', cell_style),
     Paragraph('"Подробнее" -> "Запросить КП"', cell_style)],
]

story.append(dark_table(funnel_data, col_widths=[100, 180, 170]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 14. Конверсионные воронки', caption_style))

story.append(add_heading('<b>12.2. CTA-стратегия</b>', h2_style, 1))
story.append(Paragraph(
    'На каждой странице размещено минимум 2 CTA-элемента в разных визуальных зонах. '
    'Primary CTA: "Запросить КП" (emerald-фон, белый текст, крупная кнопка). '
    'Secondary CTA: "Загрузить BOM" (outline стиль, emerald-рамка). '
    'Tertiary CTA: "Связаться с экспертом" (текстовая ссылка, muted стиль). '
    'FloatingCta-компонент отображается на всех страницах после скролла 300px, '
    'содержит кнопку "Получить КП" и телефон. Расположение: fixed bottom-right, '
    'не перекрывает основной контент, auto-hide через 10 секунд неактивности.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 13. КОНТЕНТ-СТРАТЕГИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>13. Контент-стратегия</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(add_heading('<b>13.1. Типы контента</b>', h2_style, 1))

content_data = [
    [Paragraph('<b>Тип</b>', header_cell_style),
     Paragraph('<b>Частота</b>', header_cell_style),
     Paragraph('<b>SEO-цель</b>', header_cell_style),
     Paragraph('<b>Примеры тем</b>', header_cell_style)],

    [Paragraph('Технические статьи', cell_style),
     Paragraph('2/мес', cell_center),
     Paragraph('Long-tail keywords, thought leadership', cell_style),
     Paragraph('STM32 vs ESP32, FPGA design guide, power supply design', cell_style)],

    [Paragraph('Обзоры компонентов', cell_style),
     Paragraph('4/мес', cell_center),
     Paragraph('Product SEO, cross-reference traffic', cell_style),
     Paragraph('Обзор STM32H7, сравнение Xilinx Zynq, LDO selection guide', cell_style)],

    [Paragraph('BOM-кейсы', cell_style),
     Paragraph('1/мес', cell_center),
     Paragraph('BOM SEO, trust building', cell_style),
     Paragraph('Комплектация для IoT-устройства, BOM для medical device', cell_style)],

    [Paragraph('Industry guides', cell_style),
     Paragraph('1/мес', cell_center),
     Paragraph('Industry cluster SEO', cell_style),
     Paragraph('Компоненты для automotive, medical, aerospace', cell_style)],

    [Paragraph('Glossary / FAQ', cell_style),
     Paragraph('Постоянно', cell_center),
     Paragraph('Featured snippets, voice search', cell_style),
     Paragraph('Что такое MOQ, как выбрать MCU, что такое СВП', cell_style)],

    [Paragraph('Datasheet previews', cell_style),
     Paragraph('Автоматически', cell_center),
     Paragraph('Product page depth, dwell time', cell_style),
     Paragraph('Встроенный PDF-viewer для каждого компонента', cell_style)],
]

story.append(dark_table(content_data, col_widths=[95, 60, 130, 165]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 15. Контент-стратегия', caption_style))

story.append(add_heading('<b>13.2. Content Clusters</b>', h2_style, 1))
story.append(Paragraph(
    'Контент организован в тематические кластеры: каждый кластер имеет pillar-страницу '
    '(например, "/category/microcontrollers") и набор поддерживающих страниц: блог-статьи, '
    'карточки ключевых компонентов, cross-reference страницы, FAQ. Кластер "STM32" включает: '
    'pillar-страницу категории Microcontrollers, бренд-страницу STMicroelectronics, '
    'карточки топ-20 STM32-компонентов, блог-статьи "STM32 vs ESP32", "STM32H7 обзор", '
    'FAQ "Какой STM32 выбрать". Это создаёт тематическую authority и концентрирует '
    'релевантность вокруг ключевых запросов.',
    body_justify
))

# ════════════════════════════════════════════════════════
# 14. ВИЗУАЛЬНАЯ АССОЦИАЦИЯ
# ════════════════════════════════════════════════════════
story.append(Spacer(1, 12))
story.append(add_heading('<b>14. Визуальная ассоциация и брендинг</b>', h1_style, 0))
story.append(AccentLine())
story.append(Spacer(1, 8))

story.append(Paragraph(
    'Визуальная система ChipNet.ru должна мгновенно ассоциироваться с semiconductor-индустрией, '
    'промышленными технологиями и глобальной цепочкой поставок электронных компонентов. '
    'Ключевые визуальные метафоры: circuit board traces (как декоративные элементы), '
    'signal waveform (в анимациях), chip die patterns (в background-текстурах), '
    'data flow diagrams (в workflow-секциях). Анимации используются сдержанно и целенаправленно: '
    'subtle pulse на availability-бейджах, smooth transition при фильтрации, parallax на '
    'Hero-секции. Общий тон: сдержанный, технологичный, professional - без излишней '
    'декоративности, но с вниманием к деталям, которые ценит техническая аудитория. '
    'Favicon и logo используют SVG-иконку чипа (IC package с pin-out), что является '
    'универсальным символом semiconductor-индустрии.',
    body_justify
))

story.append(Spacer(1, 8))

brand_data = [
    [Paragraph('<b>Элемент</b>', header_cell_style),
     Paragraph('<b>Реализация</b>', header_cell_style)],

    [Paragraph('Logo', cell_style),
     Paragraph('SVG chip icon + "ChipNet" (Inter Bold) + "Net" в акцентном цвете', cell_style)],

    [Paragraph('Favicon', cell_style),
     Paragraph('Упрощённый chip icon, emerald на прозрачном фоне', cell_style)],

    [Paragraph('Background', cell_style),
     Paragraph('Тёмный (#050807) с subtle grid pattern (circuit traces)', cell_style)],

    [Paragraph('Decorative', cell_style),
     Paragraph('Тонкие горизонтальные линии (signal traces), точечные маркеры (solder points)', cell_style)],

    [Paragraph('Animation', cell_style),
     Paragraph('Smooth fade-in для секций, hover glow на карточках, marquee для брендов', cell_style)],

    [Paragraph('Icons', cell_style),
     Paragraph('Heroicons (outline) + custom SVG для semiconductor-специфики', cell_style)],

    [Paragraph('Imagery', cell_style),
     Paragraph('Минимум фото, предпочтение: technical diagrams, schematics, datasheet excerpts', cell_style)],
]

story.append(dark_table(brand_data, col_widths=[100, 350]))
story.append(Spacer(1, 6))
story.append(Paragraph('Таблица 16. Визуальная система брендинга', caption_style))

# ════════════════════════════════════════════════════════
# BUILD
# ════════════════════════════════════════════════════════

doc.multiBuild(story, onLaterPages=dark_page_bg, onFirstPage=dark_page_bg)

print(f"PDF generated: {OUTPUT}")
print(f"File size: {os.path.getsize(OUTPUT)} bytes")
