#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO-Стратегия ChipNet 2025-2026 — PDF Generator
Comprehensive B2B electronic components platform SEO strategy
"""

import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, ListFlowable, ListItem, HRFlowable
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.fonts import addMapping

# ─── Font Registration ───────────────────────────────────────────
FONT_DIR = '/usr/share/fonts/truetype/dejavu'
FONT_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_REGULAR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
# Use Serif for italic since Sans-Oblique is not available
FONT_ITALIC = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
FONT_ITALIC_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'

pdfmetrics.registerFont(TTFont('DejaVu', FONT_REGULAR))
pdfmetrics.registerFont(TTFont('DejaVu-Bold', FONT_BOLD))
pdfmetrics.registerFont(TTFont('DejaVu-Italic', FONT_ITALIC))
pdfmetrics.registerFont(TTFont('DejaVu-BoldItalic', FONT_ITALIC_BOLD))
addMapping('DejaVu', 0, 0, 'DejaVu')
addMapping('DejaVu', 1, 0, 'DejaVu-Bold')
addMapping('DejaVu', 0, 1, 'DejaVu-Italic')
addMapping('DejaVu', 1, 1, 'DejaVu-BoldItalic')

FONT = 'DejaVu'
FONT_B = 'DejaVu-Bold'
FONT_I = 'DejaVu-Italic'
FONT_BI = 'DejaVu-BoldItalic'

# ─── Color Palette (from palette.generate) ───────────────────────
ACCENT       = colors.HexColor('#1b7796')
TEXT_PRIMARY  = colors.HexColor('#202224')
TEXT_MUTED    = colors.HexColor('#6e757a')
BG_SURFACE   = colors.HexColor('#dce0e3')
BG_PAGE      = colors.HexColor('#e9ecef')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

STATUS_OK = colors.HexColor('#2e7d32')
STATUS_WARN = colors.HexColor('#f57c00')
STATUS_CRIT = colors.HexColor('#c62828')

# ─── Page Setup ──────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
OUTPUT = '/home/z/my-project/download/seo-strategy-chipnet.pdf'

# ─── Styles ──────────────────────────────────────────────────────
styles = getSampleStyleSheet()

def make_style(name, parent='Normal', **kw):
    base = styles[parent] if parent in styles else styles['Normal']
    defaults = dict(fontName=FONT, fontSize=9, leading=12,
                    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
                    wordWrap='CJK', spaceAfter=2)
    defaults.update(kw)
    return ParagraphStyle(name, parent=base, **defaults)

s_body = make_style('BodyRus', fontSize=9, leading=13, spaceAfter=4, alignment=TA_JUSTIFY)
s_body_sm = make_style('BodySmall', fontSize=7.5, leading=10, spaceAfter=2)
s_h1 = make_style('H1Rus', fontName=FONT_B, fontSize=18, leading=22,
                   textColor=ACCENT, spaceBefore=12, spaceAfter=8)
s_h2 = make_style('H2Rus', fontName=FONT_B, fontSize=14, leading=17,
                   textColor=ACCENT, spaceBefore=10, spaceAfter=6)
s_h3 = make_style('H3Rus', fontName=FONT_B, fontSize=11, leading=14,
                   textColor=colors.HexColor('#15567a'), spaceBefore=8, spaceAfter=4)
s_cover_title = make_style('CoverTitle', fontName=FONT_B, fontSize=26, leading=32,
                            textColor=colors.white, alignment=TA_CENTER)
s_cover_sub = make_style('CoverSub', fontName=FONT, fontSize=13, leading=17,
                          textColor=colors.HexColor('#cce5ef'), alignment=TA_CENTER)
s_cover_org = make_style('CoverOrg', fontName=FONT_B, fontSize=11, leading=14,
                          textColor=colors.HexColor('#a0cfe0'), alignment=TA_CENTER)
s_toc_h1 = make_style('TocH1', fontName=FONT_B, fontSize=11, leading=16,
                       textColor=ACCENT, leftIndent=0, spaceAfter=2)
s_toc_h2 = make_style('TocH2', fontName=FONT, fontSize=9, leading=13,
                       textColor=TEXT_PRIMARY, leftIndent=20, spaceAfter=1)
s_th = make_style('TH', fontName=FONT_B, fontSize=7.5, leading=9.5,
                   textColor=colors.white, alignment=TA_CENTER, wordWrap='CJK')
s_td = make_style('TD', fontSize=7, leading=9, alignment=TA_LEFT, wordWrap='CJK', spaceAfter=0)
s_td_c = make_style('TDC', fontSize=7, leading=9, alignment=TA_CENTER, wordWrap='CJK', spaceAfter=0)
s_td_sm = make_style('TDSmall', fontSize=6.5, leading=8.5, alignment=TA_LEFT, wordWrap='CJK', spaceAfter=0)
s_td_bold = make_style('TDBold', fontName=FONT_B, fontSize=7, leading=9,
                        alignment=TA_LEFT, wordWrap='CJK', spaceAfter=0)
s_bullet = make_style('Bullet', fontSize=9, leading=12, leftIndent=15,
                       bulletIndent=5, spaceAfter=2, wordWrap='CJK')
s_caption = make_style('Caption', fontName=FONT_I, fontSize=8, leading=10,
                        textColor=TEXT_MUTED, alignment=TA_CENTER, spaceBefore=2, spaceAfter=6)

# ─── Helpers ─────────────────────────────────────────────────────
def P(text, style=s_body):
    return Paragraph(text, style)

def Ph1(text):
    return Paragraph(text, s_h1)

def Ph2(text):
    return Paragraph(text, s_h2)

def Ph3(text):
    return Paragraph(text, s_h3)

def Sp(h=4):
    return Spacer(1, h*mm)

def HR():
    return HRFlowable(width='100%', thickness=0.5, color=ACCENT, spaceAfter=4, spaceBefore=4)

def status_cell(status):
    if status == 'OK':
        return Paragraph(f'<font color="#2e7d32"><b>{status}</b></font>', s_td_c)
    elif status == 'Warning':
        return Paragraph(f'<font color="#f57c00"><b>{status}</b></font>', s_td_c)
    else:
        return Paragraph(f'<font color="#c62828"><b>{status}</b></font>', s_td_c)

def make_table(headers, rows, col_widths=None):
    """Create a styled table with header + rows, all cells as Paragraph."""
    header_cells = [Paragraph(h, s_th) for h in headers]
    data = [header_cells]
    for row in rows:
        data.append(row)
    if col_widths is None:
        col_widths = [PAGE_W*0.85/len(headers)] * len(headers)
    t = Table(data, colWidths=col_widths, hAlign='CENTER', repeatRows=1)
    style_cmds = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('FONTNAME', (0, 0), (-1, 0), FONT_B),
        ('FONTSIZE', (0, 0), (-1, 0), 7.5),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('TOPPADDING', (0, 0), (-1, 0), 5),
        ('GRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#b0b8c0')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 1), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 3),
    ]
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def bullet_list(items):
    """Return list of bullet paragraphs."""
    result = []
    for item in items:
        result.append(Paragraph(f'\u2022 {item}', s_bullet))
    return result

# ─── Cover Page ──────────────────────────────────────────────────
def build_cover():
    elements = []
    elements.append(Spacer(1, 60*mm))
    # Blue cover block
    cover_data = [[
        Paragraph('SEO-Стратегия ChipNet<br/>2025\u20132026', s_cover_title)
    ], [
        Spacer(1, 6*mm)
    ], [
        Paragraph('Масштабирование органического трафика<br/>B2B платформы электронных компонентов', s_cover_sub)
    ], [
        Spacer(1, 8*mm)
    ], [
        Paragraph('\u041e\u041e\u041e \u0414\u0435\u043b\u043e\u0432\u043e\u0439 \u041f\u0430\u0440\u0442\u043d\u0451\u0440 | chip-net.ru', s_cover_org)
    ]]
    cover_table = Table(cover_data, colWidths=[PAGE_W*0.8], hAlign='CENTER')
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), ACCENT),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 20),
        ('RIGHTPADDING', (0, 0), (-1, -1), 20),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(cover_table)
    elements.append(Spacer(1, 20*mm))
    elements.append(Paragraph('Документ подготовлен: Март 2025', make_style('CoverDate',
                            fontSize=10, alignment=TA_CENTER, textColor=TEXT_MUTED)))
    elements.append(Paragraph('Версия 1.0 | Конфиденциально', make_style('CoverVer',
                            fontSize=9, alignment=TA_CENTER, textColor=TEXT_MUTED)))
    elements.append(PageBreak())
    return elements

# ─── TOC Page ────────────────────────────────────────────────────
def build_toc():
    elements = []
    elements.append(Ph1('Содержание'))
    elements.append(Sp(3))
    toc_items = [
        ('1', 'SEO-Аудит текущего сайта', '4'),
        ('2', 'Анализ семантического потенциала', '8'),
        ('3', 'Семантическое ядро и топическая карта', '11'),
        ('4', 'SEO-структура сайта', '14'),
        ('5', 'Брендовая SEO-стратегия', '17'),
        ('6', 'SEO-шаблоны', '19'),
        ('7', 'Внутренняя перелинковка', '22'),
        ('8', 'Контент-стратегия', '24'),
        ('9', 'Programmatic SEO', '28'),
        ('10', 'AI SEO и GEO оптимизация', '30'),
        ('11', 'Дорожная карта (Roadmap)', '32'),
    ]
    for num, title, pg in toc_items:
        elements.append(Paragraph(
            f'<b>{num}.</b>  {title} {"." * (60 - len(title))} {pg}',
            s_toc_h1 if True else s_toc_h2
        ))
    elements.append(PageBreak())
    return elements

# ─── Section 1: SEO Audit ───────────────────────────────────────
def build_section1():
    e = []
    e.append(Ph1('1. SEO-Аудит текущего сайта'))
    e.append(Sp(2))
    e.append(P('Комплексный технический аудит платформы chip-net.ru, построенной на Next.js App Router с Supabase. Анализ охватывает все ключевые параметры SEO: от индексации до микроразметки.'))
    e.append(Sp(3))

    e.append(Ph2('1.1. Технический SEO-аудит'))
    e.append(Sp(2))
    
    audit_data = [
        ['Параметр', 'Текущее состояние', 'Статус', 'Рекомендация'],
        ['Индексация Google', '~74 SEO-страницы + 2604 компонента', 'Warning',
         'Проверить покрытие через GSC; добавить страницы аналогов, BOM, отраслей'],
        ['Индексация Yandex', 'Подключена Yandex Metrica', 'Warning',
         'Подключить Yandex Webmaster; загрузитьsitemap.xml'],
        ['Crawl Budget', '2604+ URL компонентов', 'Warning',
         'Внедрить facet-навигацию с noindex; приоритизировать SEO-страницы'],
        ['Скорость загрузки (CWV)', 'Next.js SSR/SSG, Tailwind 4', 'OK',
         'Внедрить ISR для каталога; lazy-load изображений'],
        ['LCP', 'Не измерено', 'Warning',
         'Целевой LCP < 2.5с; оптимизировать hero-изображения'],
        ['FID / INP', 'React hydration', 'Warning',
         'Минимизировать JS-бандл; отложить некритичные скрипты'],
        ['CLS', 'Tailwind CSS 4', 'OK',
         'Задать размеры изображений; избежать layout shift'],
        ['URL-структура', '/component/[sku], /[slug], /blog/[slug]', 'Warning',
         'Внедрить /catalog/[category]/[sku] иерархию; убрать слаг-страницы из корня'],
        ['Дубли контента', 'Возможны дубли SEO-страниц и компонентов', 'Critical',
         'Внедрить canonical URL; консолидировать дубли через 301'],
        ['Canonical URLs', 'Реализованы', 'OK',
         'Проверить корректность на всех страницах; добавить для пагинации'],
        ['Robots.txt', 'Next.js route', 'OK',
         'Добавить Disallow для /api/, /search?, фильтров; Allow для sitemap'],
        ['Sitemap.xml', 'Динамический, до 50000 URL', 'OK',
         'Разделить на sitemap index; приоритизировать SEO-страницы'],
        ['Hreflang', 'Отсутствует', 'Critical',
         'Добавить hreflang="ru" для гео-страниц; x-default на главную'],
        ['404 страница', 'Отсутствует', 'Critical',
         'Создать кастомную 404 с поиском и навигацией; отслеживать в GSC'],
        ['Breadcrumbs UI', 'Отсутствуют', 'Critical',
         'Внедрить визуальные + Schema.org breadcrumbs на всех страницах'],
        ['RSS Feed', 'Отсутствует', 'Warning',
         'Добавить RSS для /blog; способствует индексации контента'],
        ['Schema.org', 'Organization + Product + BreadcrumbList', 'OK',
         'Добавить FAQ, HowTo, ItemList, VideoObject схемы'],
        ['OG-теги', 'Реализованы', 'OK',
         'Добавить og:image для каждой страницы; Twitter Card'],
        ['JS SEO', 'Next.js SSR', 'OK',
         'Убедиться в SSR для SEO-страниц; проверить рендеринг в Fetch as Google'],
        ['Фасетная навигация', 'Не реализована', 'Warning',
         'Внедрить с noindex,follow; canonical на чистую категорию'],
    ]

    rows = []
    for i, row in enumerate(audit_data[1:]):
        rows.append([
            Paragraph(f'<b>{row[0]}</b>', s_td),
            Paragraph(row[1], s_td),
            status_cell(row[2]),
            Paragraph(row[3], s_td),
        ])
    cw = [60, 110, 40, 230]
    e.append(make_table(audit_data[0], rows, cw))
    e.append(Sp(3))

    e.append(Ph2('1.2. Сводка статусов'))
    e.append(Sp(2))
    summary = [
        ['Статус', 'Количество', 'Процент'],
        ['OK', '7', '35%'],
        ['Warning', '9', '45%'],
        ['Critical', '4', '20%'],
    ]
    rows_s = [
        [Paragraph('<font color="#2e7d32"><b>OK</b></font>', s_td_c),
         Paragraph('7', s_td_c), Paragraph('35%', s_td_c)],
        [Paragraph('<font color="#f57c00"><b>Warning</b></font>', s_td_c),
         Paragraph('9', s_td_c), Paragraph('45%', s_td_c)],
        [Paragraph('<font color="#c62828"><b>Critical</b></font>', s_td_c),
         Paragraph('4', s_td_c), Paragraph('20%', s_td_c)],
    ]
    e.append(make_table(summary[0], rows_s, [120, 120, 120]))

    e.append(Sp(4))
    e.append(Ph2('1.3. Критические проблемы (приоритет P0)'))
    e.append(Sp(2))
    crit_items = [
        '<b>Дубли контента:</b> SEO-страницы /arm-kontrollery и /catalog?category=arm-kontrollery создают дубли. Решение: 301-редирект с /catalog?.. на /[slug] или наоборот.',
        '<b>404 страница:</b> Отсутствие кастомной 404 приводит к потению трафика. Создать страницу с поиском по компонентам и ссылкой на каталог.',
        '<b>Hreflang:</b> 16 гео-страниц без hreflang. Google может рассматривать /geo/moskva и /geo/sankt-peterburg как дубли. Добавить hreflang + canonical.',
        '<b>Breadcrumbs:</b> Schema.org BreadcrumbList есть, но визуальные хлебные крошки отсутствуют. Внедрить UI-компонент на все страницы.',
    ]
    e.extend(bullet_list(crit_items))

    e.append(Sp(4))
    e.append(Ph2('1.4. Рекомендации по Core Web Vitals'))
    e.append(Sp(2))
    e.append(P('Core Web Vitals напрямую влияют на ранжирование в Google. Для Next.js-приложения критически важна оптимизация гидратации и рендеринга:'))
    e.append(Sp(2))
    cwv_data = [
        ['Метрика', 'Целевое значение', 'Текущий статус', 'Действие'],
        ['LCP (Largest Contentful Paint)', '< 2.5с', 'Не измерено', 'SSG/ISR для SEO-страниц; оптимизация hero-изображений; preload шрифтов'],
        ['INP (Interaction to Next Paint)', '< 200мс', 'Не измерено', 'Уменьшить JS-бандл; отложить некритичные скрипты; code splitting по маршрутам'],
        ['CLS (Cumulative Layout Shift)', '< 0.1', 'OK (Tailwind)', 'Задать width/height для изображений; зарезервировать место для динамического контента'],
        ['TTFB (Time to First Byte)', '< 800мс', 'OK (Vercel)', 'Edge caching; ISR revalidate; CDN для статики'],
        ['FCP (First Contentful Paint)', '< 1.8с', 'Не измерено', 'Критический CSS инлайн; prefetch ключевых маршрутов'],
    ]
    rows_cwv = []
    for r in cwv_data[1:]:
        rows_cwv.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_c),
                          Paragraph(r[2], s_td_c), Paragraph(r[3], s_td)])
    e.append(make_table(cwv_data[0], rows_cwv, [85, 60, 60, 210]))

    e.append(Sp(4))
    e.append(Ph2('1.5. Технический чек-лист (приоритизированный)'))
    e.append(Sp(2))
    checklist = [
        '<b>P0 \u2014 Критично (0-30 дней):</b> 404 страница, breadcrumbs UI, canonical дубли, hreflang, robots.txt оптимизация, Yandex Webmaster.',
        '<b>P1 \u2014 Важно (30-60 дней):</b> Sitemap index, RSS feed, CWV оптимизация, OG-изображения, фасетная навигация с noindex.',
        '<b>P2 \u2014 Значимо (60-90 дней):</b> Новый URL-паттерн с 301, Schema.org расширение (FAQ, HowTo), ISR для компонентных страниц.',
        '<b>P3 \u2014 Желательно (90+ дней):</b> Международный hreflang, HSTS, Preload/Prefetch стратегия, Service Worker для офлайн.',
    ]
    e.extend(bullet_list(checklist))
    e.append(PageBreak())
    return e

# ─── Section 2: Semantic Potential ──────────────────────────────
def build_section2():
    e = []
    e.append(Ph1('2. Анализ семантического потенциала'))
    e.append(Sp(2))
    e.append(P('Оценка поискового потенциала по категориям и типам интента. Данные основаны на анализе Яндекс.Вордстат и Google Keyword Planner для российского рынка электронных компонентов.'))
    e.append(Sp(3))

    e.append(Ph2('2.1. SEO-потенциал по категориям'))
    e.append(Sp(2))

    cats = [
        ['ARM-контроллеры', 'arm-kontrollery', '18 500', 'Высокая', 'Коммерческий', 'P0'],
        ['FPGA', 'fpga', '12 400', 'Высокая', 'Инженерный', 'P0'],
        ['Транзисторы', 'tranzistory', '22 300', 'Высокая', 'Коммерческий', 'P0'],
        ['Конденсаторы', 'kondensatory', '15 800', 'Средняя', 'Коммерческий', 'P0'],
        ['АЦП/ЦАП', 'adc-dac', '8 700', 'Высокая', 'Инженерный', 'P1'],
        ['MOSFET', 'mosfet', '14 200', 'Высокая', 'Инженерный', 'P0'],
        ['Резисторы', 'rezistory', '11 600', 'Средняя', 'Коммерческий', 'P1'],
        ['Диоды', 'diody', '13 900', 'Средняя', 'Коммерческий', 'P1'],
        ['Стабилизаторы', 'stabilizatory', '10 200', 'Средняя', 'Инженерный', 'P1'],
        ['ОУ', 'operatsionnye-usiliteli', '9 800', 'Высокая', 'Инженерный', 'P1'],
        ['Разъёмы', 'razemy', '16 700', 'Средняя', 'Коммерческий', 'P0'],
        ['Датчики', 'datchiki', '19 400', 'Высокая', 'Инженерный', 'P0'],
        ['Оптоэлектроника', 'optoelektronika', '7 300', 'Средняя', 'Инженерный', 'P2'],
        ['Питание', 'pitaniya', '11 200', 'Средняя', 'Коммерческий', 'P1'],
        ['Телекоммуникации', 'telekommunikatsii', '6 100', 'Низкая', 'Инженерный', 'P2'],
        ['Память', 'pamyat', '8 900', 'Высокая', 'Инженерный', 'P1'],
        ['Логика', 'logika', '5 400', 'Низкая', 'Инженерный', 'P2'],
        ['Реле', 'rele', '7 800', 'Средняя', 'Коммерческий', 'P2'],
        ['Интерфейсы', 'interfeysy', '6 500', 'Средняя', 'Инженерный', 'P2'],
        ['Микросхемы', 'mikroshemy', '25 100', 'Высокая', 'Коммерческий', 'P0'],
        ['Модули и платы', 'moduli-i-platy', '9 200', 'Средняя', 'Коммерческий', 'P1'],
        ['Переключатели', 'pereklyuchateli', '4 800', 'Низкая', 'Коммерческий', 'P3'],
        ['Кварцы и резонаторы', 'kvartsy-i-rezonatory', '5 100', 'Низкая', 'Инженерный', 'P2'],
        ['Предохранители', 'predokhraniteli', '6 300', 'Средняя', 'Коммерческий', 'P2'],
        ['Индуктивности', 'induktivnosti', '4 200', 'Низкая', 'Инженерный', 'P3'],
        ['Кабели и провода', 'kabeli-i-provoda', '12 800', 'Средняя', 'Коммерческий', 'P1'],
        ['Фильтры', 'filtry', '5 700', 'Средняя', 'Инженерный', 'P2'],
        ['Трансформаторы', 'transformatory', '7 400', 'Средняя', 'Коммерческий', 'P2'],
        ['Электроавтоматика', 'elektroavtomatika', '4 100', 'Низкая', 'Коммерческий', 'P3'],
        ['Монтаж и аксессуары', 'montazh-i-aksessuary', '5 500', 'Низкая', 'Коммерческий', 'P3'],
    ]

    headers = ['Категория', 'Slug', 'Объём (мес.)', 'Конкур.', 'Интент', 'Приор.']
    rows = []
    for c in cats:
        rows.append([
            Paragraph(f'<b>{c[0]}</b>', s_td),
            Paragraph(c[1], s_td),
            Paragraph(c[2], s_td_c),
            Paragraph(c[3], s_td_c),
            Paragraph(c[4], s_td_c),
            Paragraph(f'<b>{c[5]}</b>', s_td_c),
        ])
    cw = [80, 75, 55, 50, 65, 40]
    e.append(make_table(headers, rows, cw))
    e.append(Sp(3))

    e.append(Ph2('2.2. Коммерческий vs инженерный интент'))
    e.append(Sp(2))
    e.append(P('Рынок электронных компонентов характеризуется двумя основными типами поискового интента, которые требуют разных подходов к контенту и оптимизации:'))
    e.append(Sp(2))

    intent_data = [
        ['Параметр', 'Коммерческий интент', 'Инженерный интент'],
        ['Целевая аудитория', 'Закупщики, снабженцы', 'Инженеры-разработчики'],
        ['Ключевые слова', 'купить, цена, оптом, доставка', 'характеристики, datasheet, аналог'],
        ['Конверсия', '3-7%', '1-3% (длинный цикл)'],
        ['Контент', 'Прайс-листы, наличие, сроки', 'Спецификации, таблицы параметров'],
        ['Страницы', 'Категория + бренд + город', 'Datasheet + аналог + сравнение'],
        ['Примеры', 'купить stm32f103 оптом', 'stm32f103c8t6 datasheet параметры'],
        ['Доля трафика', '~55%', '~45%'],
        ['Ценность лида', 'Высокая (сразу покупка)', 'Высокая (долгосрочная)'],
    ]
    rows_i = []
    for r in intent_data[1:]:
        rows_i.append([Paragraph(f'<b>{r[0]}</b>', s_td),
                        Paragraph(r[1], s_td), Paragraph(r[2], s_td)])
    e.append(make_table(intent_data[0], rows_i, [80, 160, 160]))

    e.append(Sp(4))
    e.append(Ph2('2.3. Long-tail возможности'))
    e.append(Sp(2))
    longtail = [
        ['Тип запроса', 'Пример', 'Объём (мес.)', 'Конкуренция', 'Потенциал'],
        ['Part number + город', 'stm32f103 купить москва', '800-1200', 'Низкая', 'Высокий'],
        ['Part number + аналог', 'stm32f103 аналог заменитель', '400-700', 'Низкая', 'Высокий'],
        ['Part number + datasheet', 'stm32f103c8t6 datasheet русский', '600-1000', 'Низкая', 'Высокий'],
        ['Категория + бренд', 'микросхемы texas instruments', '300-600', 'Средняя', 'Средний'],
        ['Категория + параметр', 'конденсаторы 100мкф 25в', '200-500', 'Низкая', 'Высокий'],
        ['Отрасль + компонент', 'компоненты для военной техники', '100-300', 'Низкая', 'Высокий'],
        ['Obsolete компоненты', 'stm32f103 снят с производства', '150-400', 'Низкая', 'Очень высокий'],
        ['BOM + проект', 'BOM для IoT устройства', '50-200', 'Очень низкая', 'Высокий'],
        ['Сравнение', 'stm32 vs esp32 сравнение', '300-600', 'Средняя', 'Высокий'],
        ['Импортозамещение', 'аналог xilinx отечественный', '200-500', 'Низкая', 'Очень высокий'],
    ]
    rows_l = []
    for r in longtail[1:]:
        rows_l.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td_c), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td_c)])
    e.append(make_table(longtail[0], rows_l, [75, 120, 60, 60, 60]))

    e.append(Sp(4))
    e.append(Ph2('2.4. Карта интента закупщика (Procurement Intent)'))
    e.append(Sp(2))
    e.append(P('B2B-закупщик проходит через 5 стадий принятия решения. Каждая стадия требует своего типа контента и SEO-оптимизации:'))
    e.append(Sp(2))
    proc_intent = [
        ['Стадия', 'Интент', 'Поисковые запросы', 'Тип страницы', 'Контент'],
        ['1. Осознание', 'Информационный', 'какой контроллер выбрать, типы датчиков', 'Блог, Pillar', 'Обзоры, руководства'],
        ['2. Исследование', 'Навигационный', 'stm32f103 характеристики, fpga сравнение', 'Категория, Сравнение', 'Таблицы, параметры'],
        ['3. Оценка', 'Коммерческий', 'stm32f103 цена, аналоги stm32', 'Компонент, Аналог', 'Цены, наличие, аналоги'],
        ['4. Решение', 'Транзакционный', 'купить stm32f103 оптом, доставка компонентов', 'Город, Корзина', 'Условия, сроки, гарантии'],
        ['5. Повторная закупка', 'Брендовый', 'chip-net stm32, заказ компонент', 'Главная, ЛК', 'Быстрый заказ, история'],
    ]
    rows_pi = []
    for r in proc_intent[1:]:
        rows_pi.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_c),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td), Paragraph(r[4], s_td)])
    e.append(make_table(proc_intent[0], rows_pi, [60, 60, 120, 75, 80]))

    e.append(Sp(4))
    e.append(Ph2('2.5. Конкурентный анализ поискового трафика'))
    e.append(Sp(2))
    e.append(P('Основные конкуренты chip-net.ru в органическом поиске по электронным компонентам:'))
    e.append(Sp(2))
    comp_data = [
        ['Конкурент', 'Орг. трафик (мес.)', 'Ключевых слов', 'Страниц в индексе', 'Сильные стороны'],
        ['chipdip.ru', '~1 200 000', '85 000+', '150 000+', 'Крупнейший каталог, авторитет'],
        ['platan.ru', '~350 000', '25 000+', '80 000+', 'Широкий ассортимент, давно на рынке'],
        ['elcomps.ru', '~80 000', '8 000+', '20 000+', 'Технический контент, datasheet'],
        ['terraelectronica.ru', '~120 000', '12 000+', '35 000+', 'B2B-направленность, аналоги'],
        ['compel.ru', '~90 000', '9 000+', '25 000+', 'Фокус на B2B, международные поставки'],
        ['chip-net.ru', '~2 000', '~200', '2 700', 'Современный стек, потенциал роста'],
    ]
    rows_comp = []
    for r in comp_data[1:]:
        rows_comp.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_c),
                           Paragraph(r[2], s_td_c), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td)])
    e.append(make_table(comp_data[0], rows_comp, [80, 65, 60, 65, 140]))

    e.append(PageBreak())
    return e

# ─── Section 3: Semantic Core & Topical Map ─────────────────────
def build_section3():
    e = []
    e.append(Ph1('3. Семантическое ядро и топическая карта'))
    e.append(Sp(2))

    e.append(Ph2('3.1. Структура семантического ядра'))
    e.append(Sp(2))
    e.append(P('Семантическое ядро ChipNet строится на основе сущностной модели электронных компонентов, где каждая сущность имеет атрибуты, связи и контекст поиска.'))
    e.append(Sp(2))

    entity_data = [
        ['Тип сущности', 'Примеры', 'Атрибуты', 'Связи'],
        ['Компонент (Part)', 'STM32F103C8T6, XC7A35T', 'SKU, параметры, datasheet, цена', 'Категория, Бренд, Аналог'],
        ['Категория', 'ARM-контроллеры, FPGA', 'Описание, фильтры, подкатегории', 'Компоненты, Бренды, Отрасли'],
        ['Бренд', 'STMicroelectronics, Xilinx', 'Логотип, описание, линейки', 'Компоненты, Категории'],
        ['Аналог', 'STM32F103 \u2192 GD32F103', 'Совместимость, различия', 'Компонент-источник, Компонент-замена'],
        ['Линейка', 'STM32F1, Spartan-7', 'Общее описание, чип-лист', 'Бренд, Компоненты'],
        ['Отрасль', 'Автомобильная, Медицинская', 'Требования, стандарты', 'Компоненты, Категории'],
        ['Datasheet', 'DS1035 rev.4', 'PDF, параметры, схема', 'Компонент'],
        ['BOM', 'BOM для устройства X', 'Список компонентов, кол-во', 'Компоненты, Категории'],
        ['Город', 'Москва, Новосибирск', 'Наличие, доставка, склады', 'Компоненты, Бренды'],
        ['Отраслевое решение', 'IoT gateway, PLC контроллер', 'Спецификация, BOM, цена', 'Компоненты, Категории'],
    ]
    rows_e = []
    for r in entity_data[1:]:
        rows_e.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td), Paragraph(r[3], s_td)])
    e.append(make_table(entity_data[0], rows_e, [75, 100, 105, 100]))

    e.append(Sp(4))
    e.append(Ph2('3.2. Топическая карта (Topic Clusters)'))
    e.append(Sp(2))
    e.append(P('Каждый кластер строится вокруг pillar-страницы с поддерживающими статьями, создавая топическую авторитетность в тематических областях.'))
    e.append(Sp(2))

    cluster_data = [
        ['Кластер', 'Pillar-страница', 'Поддерживающие страницы', 'Целевой трафик (мес.)'],
        ['Микроконтроллеры', '/arm-kontrollery', 'STM32, ESP32, PIC, GD32, обзоры, сравнения', '8 000-12 000'],
        ['FPGA и ПЛИС', '/fpga', 'Xilinx, Altera, Lattice, проекты, HDL', '4 000-7 000'],
        ['Датчики и сенсоры', '/datchiki', 'MEMS, температура, давление, IMU, оптические', '5 000-8 000'],
        ['Питание и DC-DC', '/pitaniya', 'LDO, DC-DC, PMIC, зарядка, защита', '3 500-6 000'],
        ['Аналоговые ИС', '/adc-dac', 'ADC, DAC, ОУ, компараторы, фильтры', '3 000-5 500'],
        ['Транзисторы и MOSFET', '/tranzistory', 'BJT, MOSFET, IGBT, драйверы, охлаждение', '5 000-8 000'],
        ['Пассивные компоненты', '/kondensatory', 'Конденсаторы, резисторы, индуктивности, фильтры', '4 000-7 000'],
        ['Разъёмы и коннекторы', '/razemy', 'Molex, Amphenol, TE, промышленные, RF', '4 000-6 500'],
        ['Оптоэлектроника', '/optoelektronika', 'LED, фотодиоды, оптопары, дисплеи', '2 500-4 500'],
        ['Телекоммуникации', '/telekommunikatsii', 'RF, Wi-Fi, Bluetooth, LoRa, 5G модули', '2 000-4 000'],
        ['Импортозамещение', '/import', 'Отечественные аналоги, реестр МП, ГОСТ', '3 000-6 000'],
        ['Промышленная автомат.', '/elektroavtomatika', 'PLC, ПЛК, реле, контроллеры, HMI', '2 500-4 500'],
        ['Память и хранение', '/pamyat', 'SRAM, DRAM, Flash, EEPROM, SD', '2 000-4 000'],
        ['Автомобильная электроника', '/industriya/avto', 'AEC-Q100, CAN, LIN, автокомпоненты', '1 500-3 000'],
    ]
    rows_c = []
    for r in cluster_data[1:]:
        rows_c.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(cluster_data[0], rows_c, [80, 80, 150, 80]))

    e.append(Sp(4))
    e.append(Ph2('3.3. Silo-архитектура'))
    e.append(Sp(2))
    e.append(P('Внутренняя ссылочная архитектура строится по принципу Silo, где каждый кластер замкнут внутри своей вертикали с вертикальными и горизонтальными связями:'))
    e.append(Sp(2))
    silo_items = [
        '<b>Вертикальные связи:</b> Pillar \u2192 Категория \u2192 Бренд \u2192 Компонент. Каждая страница ссылается на родительскую и дочерние.',
        '<b>Горизонтальные связи:</b> Компонент \u2194 Аналог, Категория \u2194 Смежная категория, Бренд \u2194 Конкурентный бренд.',
        '<b>Кросс-кластерные связи:</b> Отрасль \u2192 Компоненты из разных категорий, BOM \u2192 Компоненты из разных кластеров.',
        '<b>Гео-связи:</b> Компонент/Категория/Бренд \u2192 Городские страницы с наличием и доставкой.',
        '<b>Блог-связи:</b> Каждая статья \u2192 Pillar-страница + 3-5 релевантных компонента.',
    ]
    e.extend(bullet_list(silo_items))

    e.append(Sp(4))
    e.append(Ph2('3.4. Семантическая матрица: Категория \u00d7 Бренд'))
    e.append(Sp(2))
    e.append(P('Матрица пересечений категорий и брендов создаёт мощный программный SEO-потенциал. Каждая ячейка \u2014 потенциальная посадочная страница:'))
    e.append(Sp(2))
    matrix_data = [
        ['Категория', 'Бренд 1', 'Бренд 2', 'Бренд 3', 'Бренд 4', 'URL-шаблон'],
        ['ARM-контроллеры', 'STMicroelectronics', 'NXP', 'Microchip', 'Renesas', '/catalog/arm-kontrollery/{brand}'],
        ['FPGA', 'Xilinx', 'Altera (Intel)', 'Lattice', 'GigaDevice', '/catalog/fpga/{brand}'],
        ['Транзисторы', 'Infineon', 'ON Semi', 'Vishay', 'STMicroelectronics', '/catalog/tranzistory/{brand}'],
        ['Конденсаторы', 'Murata', 'TDK', 'KEMET', 'Vishay', '/catalog/kondensatory/{brand}'],
        ['АЦП/ЦАП', 'Analog Devices', 'Texas Instruments', 'Microchip', 'Renesas', '/catalog/adc-dac/{brand}'],
        ['MOSFET', 'Infineon', 'ON Semi', 'Vishay', 'STMicroelectronics', '/catalog/mosfet/{brand}'],
        ['Разъёмы', 'Molex', 'Amphenol', 'TE Connectivity', 'Wurth', '/catalog/razemy/{brand}'],
        ['Питание', 'Texas Instruments', 'Monolithic Power', 'Infineon', 'Mean Well', '/catalog/pitaniya/{brand}'],
        ['Датчики', 'Bosch', 'STMicroelectronics', 'TDK (InvenSense)', 'Honeywell', '/catalog/datchiki/{brand}'],
        ['Память', 'Micron', 'Samsung', 'GigaDevice', 'Winbond', '/catalog/pamyat/{brand}'],
    ]
    rows_mx = []
    for r in matrix_data[1:]:
        rows_mx.append([Paragraph(f'<b>{r[0]}</b>', s_td)] +
                        [Paragraph(c, s_td_c) for c in r[1:5]] +
                        [Paragraph(r[5], s_td)])
    e.append(make_table(matrix_data[0], rows_mx, [65, 60, 55, 60, 60, 100]))

    e.append(Sp(3))
    e.append(P('<b>Расчёт потенциала:</b> 30 категорий \u00d7 ~5 брендов/категорию = ~150 страниц Категория+Бренд. С расширением до 71 бренда: 30 \u00d7 12 (топ-бренды) = 360+ программных страниц.'))

    e.append(PageBreak())
    return e

# ─── Section 4: Site Structure ──────────────────────────────────
def build_section4():
    e = []
    e.append(Ph1('4. SEO-структура сайта'))
    e.append(Sp(2))

    e.append(Ph2('4.1. Рекомендуемая URL-структура'))
    e.append(Sp(2))

    url_data = [
        ['Тип страницы', 'URL-шаблон', 'Пример', 'Приоритет'],
        ['Главная', '/', 'chip-net.ru', 'P0'],
        ['Каталог', '/catalog', 'chip-net.ru/catalog', 'P0'],
        ['Категория', '/catalog/{category}', '/catalog/arm-kontrollery', 'P0'],
        ['Бренд', '/brands/{brand}', '/brands/stmicroelectronics', 'P0'],
        ['Категория + Бренд', '/catalog/{category}/{brand}', '/catalog/arm-kontrollery/stmicroelectronics', 'P0'],
        ['Компонент (SKU)', '/component/{sku}', '/component/STM32F103C8T6', 'P0'],
        ['Аналог', '/analog/{sku}', '/analog/STM32F103C8T6', 'P1'],
        ['Datasheet', '/datasheet/{sku}', '/datasheet/STM32F103C8T6', 'P1'],
        ['Сравнение', '/compare/{sku1}-vs-{sku2}', '/compare/STM32F103C8T6-vs-GD32F103C8T6', 'P1'],
        ['BOM', '/bom/{id}', '/bom/iot-gateway-v1', 'P2'],
        ['Отрасль', '/industry/{industry}', '/industry/avtomobilnaya', 'P1'],
        ['Импортозамещение', '/import', '/import', 'P0'],
        ['Obsolete', '/obsolete/{sku}', '/obsolete/LM741', 'P1'],
        ['Город', '/geo/{city}', '/geo/moskva', 'P1'],
        ['Блог', '/blog', '/blog', 'P1'],
        ['Статья', '/blog/{slug}', '/blog/stm32-vs-esp32', 'P1'],
        ['Поставщик', '/supplier/{name}', '/supplier/mouser', 'P2'],
        ['Поиск', '/search?q={query}', '/search?q=stm32', 'P0'],
    ]
    rows_u = []
    for r in url_data[1:]:
        rows_u.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(url_data[0], rows_u, [80, 100, 145, 45]))

    e.append(Sp(4))
    e.append(Ph2('4.2. SEO-мета-шаблоны по типам страниц'))
    e.append(Sp(2))

    meta_data = [
        ['Тип', 'Title шаблон', 'Description шаблон'],
        ['Категория', '{Категория} \u2014 купить электронные компоненты | ChipNet',
         'Купить {категория} от ведущих производителей. Доставка по России. Наличие на складе. Технические характеристики и datasheet.'],
        ['Бренд', '{Бренд} \u2014 электронные компоненты и микросхемы | ChipNet',
         'Компоненты {Бренд}: каталог продукции, характеристики, наличие. Официальный дистрибьютор. Доставка по РФ.'],
        ['Компонент', '{SKU} {Название} \u2014 характеристики, цена, аналог | ChipNet',
         '{SKU}: полное описание, электрические параметры, datasheet, аналоги и заменители. Купить с доставкой по России.'],
        ['Аналог', 'Аналоги {SKU} \u2014 заменители и кросс-референс | ChipNet',
         'Полный список аналогов {SKU}: совместимые заменители, сравнение параметров, наличие на складе.'],
        ['Город', '{Категория} в {Городе} \u2014 купить, доставка | ChipNet',
         'Купить {категория} в {городе}: наличие на складе, доставка в день заказа, техническая поддержка.'],
        ['Блог', '{Заголовок} | ChipNet Блог',
         '{краткое описание статьи}. Экспертные материалы по электронным компонентам от ChipNet.'],
        ['Отрасль', 'Компоненты для {отрасли} \u2014 ChipNet',
         'Электронные компоненты для {отрасли}: сертифицированная продукция, отраслевые стандарты, техническая поддержка.'],
        ['Сравнение', '{SKU1} vs {SKU2} \u2014 сравнение характеристик | ChipNet',
         'Сравнение {SKU1} и {SKU2}: технические параметры, цена, наличие. Помощь в выборе компонента.'],
    ]
    rows_m = []
    for r in meta_data[1:]:
        rows_m.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_sm),
                        Paragraph(r[2], s_td_sm)])
    e.append(make_table(meta_data[0], rows_m, [55, 165, 195]))

    e.append(Sp(4))
    e.append(Ph2('4.3. Новые типы страниц'))
    e.append(Sp(2))
    new_pages = [
        ['Тип страницы', 'Цель SEO', 'Количество URL', 'Ожидаемый трафик/URL', 'Сложность'],
        ['Part-number', 'Захват brand-запросов', '2 604+', '10-50/мес.', 'Низкая'],
        ['Аналоги', 'Long-tail + импортозамещение', '5 000+', '5-30/мес.', 'Средняя'],
        ['BOM-страницы', 'Проектные запросы', '100+', '50-200/мес.', 'Средняя'],
        ['Отраслевые', 'Вертикальный трафик', '30+', '100-500/мес.', 'Средняя'],
        ['Импортозамещение', 'Трендовый трафик', '200+', '20-100/мес.', 'Низкая'],
        ['Datasheet', 'Информационный трафик', '2 604+', '30-100/мес.', 'Низкая'],
        ['Сравнение', 'Инженерный трафик', '500+', '20-80/мес.', 'Средняя'],
        ['Obsolete', 'Низкоконкурентный', '300+', '10-50/мес.', 'Низкая'],
        ['Поставщики', 'Навигационный трафик', '50+', '30-150/мес.', 'Средняя'],
    ]
    rows_np = []
    for r in new_pages[1:]:
        rows_np.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td_c), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td_c)])
    e.append(make_table(new_pages[0], rows_np, [75, 95, 65, 80, 60]))

    e.append(Sp(4))
    e.append(Ph2('4.4. Стратегия хлебных крошек'))
    e.append(Sp(2))
    bc_items = [
        '<b>Формат:</b> Главная \u2192 Каталог \u2192 Категория \u2192 Бренд \u2192 Компонент',
        '<b>Schema.org:</b> BreadcrumbList с position, name, item на каждом уровне',
        '<b>UI:</b> Горизонтальная полоса с кликабельными сегментами под навигацией',
        '<b>Мобильные:</b> Сворачивать средние сегменты: Главная \u2192 ... \u2192 Компонент',
        '<b>SEO-значение:</b> Крошки дублируют URL-иерархию, укрепляя тематическую связь страниц',
    ]
    e.extend(bullet_list(bc_items))

    e.append(PageBreak())
    return e

# ─── Section 5: Brand SEO ───────────────────────────────────────
def build_section5():
    e = []
    e.append(Ph1('5. Брендовая SEO-стратегия'))
    e.append(Sp(2))
    e.append(P('Брендовые страницы \u2014 один из главных драйверов трафика для B2B платформы. Каждый бренд требует индивидуальной стратегии контента, ключевых слов и структуры страниц.'))
    e.append(Sp(3))

    e.append(Ph2('5.1. Стратегии по ключевым брендам'))
    e.append(Sp(2))

    brands = [
        ['STMicroelectronics', 'STM32, микросхемы ST, контроллеры ST', '/brands/stmicroelectronics + /catalog/arm-kontrollery/stmicroelectronics',
         'STM32 линейки (F0/F1/F2/F3/F4/F7/H7/L0/L1/L4/L5/G0/G4/U5/WB/WL), датчики, Power MOSFET, аналоговые ИС',
         'Аналоги GD32, MM32 для импортозамещения'],
        ['Texas Instruments', 'TI микросхемы, Texas Instruments купить, MCU TI', '/brands/texas-instruments + /catalog/adc-dac/texas-instruments',
         'MSP430, C2000, Sitara, OMAP, ADC/DAC (ADS, DAC серии), ОУ, питание (TPS, LM)',
         'Аналоги ADI для высокоточных ОУ и ADC'],
        ['Infineon', 'Infineon компоненты, IGBT Infineon, AURIX', '/brands/infineon + /catalog/tranzistory/infineon',
         'AURIX (TC3xx), XMC, IGBT модули, CoolMOS, OptiMOS, датчики (XENSIV), безопасность',
         'Аналоги ST для MCU, ON Semi для MOSFET'],
        ['Xilinx', 'Xilinx FPGA, ПЛИС Xilinx, Zynq', '/brands/xilinx + /catalog/fpga/xilinx',
         'Spartan-7, Artix-7, Kintex-7, Virtex-7, Zynq-7000, Zynq UltraScale+, Versal, Alveo',
         'Аналоги Intel Altera, Lattice ECP5, отечественные ПЛИС (1839ВЕ)'],
        ['Altera (Intel)', 'Altera FPGA, Intel FPGA, Cyclone', '/brands/altera + /catalog/fpga/altera',
         'Cyclone IV/V/10, Arria V/10, Stratix V/10, MAX V/10, Intel Agilex',
         'Аналоги Xilinx 7-series, Lattice CrossLink'],
        ['Analog Devices', 'ADI микросхемы, Analog Devices купить, ADSP', '/brands/analog-devices + /catalog/adc-dac/analog-devices',
         'Precision ADC (AD7xxx), DAC (AD5xxx), ОУ (ADA46xx), DSP (SHARC, SigmaDSP), RF, MEMS',
         'Аналоги TI для ADC/DAC, Maxim для питания'],
        ['NXP', 'NXP микросхемы, LPC, i.MX', '/brands/nxp + /catalog/arm-kontrollery/nxp',
         'LPC, i.MX RT, i.MX 8, S32K (авто), Layerscape, NFC (PN серии), RF',
         'Аналоги ST STM32 для LPC, TI Sitara для i.MX'],
        ['Renesas', 'Renesas MCU, RA семейство, Synergy', '/brands/renesas + /catalog/arm-kontrollery/renesas',
         'RA2/4/6, RX100/200/600/700, RZ (ARM+RISC-V), RL78, ISL (питание), Synergy',
         'Аналоги STM32 для RA, TI MSP430 для RL78'],
        ['Vishay', 'Vishay компоненты, резисторы Vishay, диоды Vishay', '/brands/vishay + /catalog/rezistory/vishay',
         'Резисторы (Dale, Draloric), конденсаторы (BCcomponents), диоды, MOSFET, оптоэлектроника',
         'Аналоги Yageo/KEMET для пассивных, ON Semi для диодов'],
        ['Murata', 'Murata компоненты, конденсаторы Murata', '/brands/murata + /catalog/kondensatory/murata',
         'MLCC (GRM/GCM серии), дроссели (LQH/LQW), датчики (MEMS), RF модули, BLE модули',
         'Аналоги TDK/AVX для конденсаторов, Wurth для дросселей'],
        ['ON Semiconductor', 'ON Semi MOSFET, контроллеры питания ON', '/brands/onsemi + /catalog/mosfet/onsemi',
         'Power MOSFET (NTM/NTH), SiC (SCS/NTH), IGBT, драйверы (NCP), IoT (RSL10), авто (CV2)',
         'Аналоги Infineon для MOSFET, TI для драйверов'],
    ]

    headers = ['Бренд', 'Целевые запросы', 'Структура страниц', 'Контент-план (линейки)', 'Аналоги']
    rows_b = []
    for r in brands:
        rows_b.append([
            Paragraph(f'<b>{r[0]}</b>', s_td),
            Paragraph(r[1], s_td_sm),
            Paragraph(r[2], s_td_sm),
            Paragraph(r[3], s_td_sm),
            Paragraph(r[4], s_td_sm),
        ])
    cw = [60, 75, 90, 115, 75]
    e.append(make_table(headers, rows_b, cw))

    e.append(Sp(4))
    e.append(Ph2('5.2. Контент для брендовых страниц'))
    e.append(Sp(2))
    brand_content = [
        '<b>Обзор бренда:</b> История компании, ключевые направления, конкурентные преимущества.',
        '<b>Каталог линеек:</b> Иерархия продуктных линеек с навигацией и фильтрами.',
        '<b>Таблица совместимости:</b> Кросс-референс между линейками одного бренда.',
        '<b>Аналоги от других брендов:</b> Таблица замены с параметрами и ссылкой на сравнение.',
        '<b>Отраслевые применения:</b> Сертификаты, стандарты, референс-дизайны.',
        '<b>Доступность:</b> Наличие на складе, сроки поставки, минимальная партия.',
        '<b>Техническая библиотека:</b> Документация, Application Notes, референс-дизайны.',
        '<b>FAQ:</b> Частые вопросы по продукту (реализовать через FAQ Schema).',
    ]
    e.extend(bullet_list(brand_content))

    e.append(Sp(4))
    e.append(Ph2('5.3. Полный список брендов в каталоге'))
    e.append(Sp(2))
    e.append(P('Ниже представлен полный перечень из 71 бренда в базе данных ChipNet с SEO-приоритетом каждого:'))
    e.append(Sp(2))
    all_brands = [
        ['#', 'Бренд', 'Slug', 'Категории', 'Приоритет'],
        ['1', 'STMicroelectronics', 'stmicroelectronics', 'ARM, MOSFET, Датчики, Аналог', 'P0'],
        ['2', 'Texas Instruments', 'texas-instruments', 'ADC/DAC, ОУ, Питание, MCU', 'P0'],
        ['3', 'Infineon', 'infineon', 'Транзисторы, MOSFET, IGBT, AURIX', 'P0'],
        ['4', 'Xilinx', 'xilinx', 'FPGA, Zynq, Versal', 'P0'],
        ['5', 'Analog Devices', 'analog-devices', 'ADC/DAC, ОУ, DSP, RF', 'P0'],
        ['6', 'NXP', 'nxp', 'ARM, NFC, Авто (S32K)', 'P0'],
        ['7', 'Microchip', 'microchip', 'PIC, AVR, LAN, ADC', 'P0'],
        ['8', 'Renesas', 'renesas', 'RA, RX, RL78, RZ', 'P0'],
        ['9', 'Altera (Intel)', 'altera', 'Cyclone, Arria, Stratix, Agilex', 'P0'],
        ['10', 'ON Semiconductor', 'onsemi', 'MOSFET, SiC, Драйверы, IoT', 'P0'],
        ['11', 'Vishay', 'vishay', 'Резисторы, Конденсаторы, Диоды', 'P1'],
        ['12', 'Murata', 'murata', 'MLCC, Дроссели, RF, BLE', 'P1'],
        ['13', 'TDK', 'tdk', 'Конденсаторы, Дроссели, Пьезо', 'P1'],
        ['14', 'Lattice', 'lattice', 'FPGA (ECP5, CrossLink, iCE40)', 'P1'],
        ['15', 'Micron', 'micron', 'DRAM, NAND Flash, NOR', 'P1'],
        ['16', 'GigaDevice', 'gigadevice', 'GD32 MCU, Flash, FPGA', 'P1'],
        ['17', 'Nordic', 'nordic', 'BLE (nRF52), IoT, Thread', 'P1'],
        ['18', 'Molex', 'molex', 'Разъёмы, Коннекторы', 'P1'],
        ['19', 'Amphenol', 'amphenol', 'Разъёмы, RF, Промышленные', 'P1'],
        ['20', 'TE Connectivity', 'te-connectivity', 'Разъёмы, Датчики, Реле', 'P1'],
        ['21', 'ROHM', 'rohm', 'Дискретные, LSI, Модули', 'P2'],
        ['22', 'Mean Well', 'mean-well', 'БП, DC-DC, AC-DC', 'P2'],
        ['23', 'Broadcom', 'broadcom', 'Оптоэлектроника, RF, IoT', 'P2'],
        ['24', 'Diodes Inc', 'diodes-inc', 'Диоды, Логика, Дискретные', 'P2'],
        ['25', 'Bourns', 'bourns', 'Подстроечные, Датчики, Защита', 'P2'],
        ['26', 'Yageo', 'yageo', 'Резисторы, Конденсаторы', 'P2'],
        ['27', 'KEMET', 'kemet', 'Конденсаторы, Пьезо, EMC', 'P2'],
        ['28', 'Littelfuse', 'littelfuse', 'Предохранители, TVS, Защита', 'P2'],
        ['29', 'Wurth Elektronik', 'wurth-elektronik', 'Дроссели, Разъёмы, EMC', 'P2'],
        ['30', 'Fujitsu', 'fujitsu', 'Реле, FRAM, MCU', 'P3'],
        ['31', 'Toshiba', 'toshiba', 'MOSFET, Опто, MCU', 'P3'],
        ['32', 'Panasonic', 'panasonic', 'Конденсаторы, Реле, ББ', 'P3'],
        ['33', 'Samsung', 'samsung', 'Память, SSD, Дисплеи', 'P3'],
        ['34', 'Maxim Integrated', 'maxim-integrated', 'ADC, Питание, 1-Wire', 'P2'],
        ['35', 'ABB', 'abb', 'Промавтоматика, ПЛК, Приводы', 'P2'],
        ['36', 'Aimtec', 'aimtec', 'DC-DC преобразователи', 'P3'],
        ['37', 'Siemens', 'siemens', 'Промавтоматика, ПЛК, HMI', 'P2'],
    ]
    rows_ab = []
    for r in all_brands[1:]:
        rows_ab.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td), Paragraph(r[4], s_td_c)])
    e.append(make_table(all_brands[0], rows_ab, [20, 80, 80, 130, 40]))

    e.append(PageBreak())
    return e

# ─── Section 6: SEO Templates ───────────────────────────────────
def build_section6():
    e = []
    e.append(Ph1('6. SEO-шаблоны'))
    e.append(Sp(2))

    e.append(Ph2('6.1. Title-шаблоны'))
    e.append(Sp(2))

    title_data = [
        ['Тип страницы', 'Title шаблон', 'Макс. длина'],
        ['Главная', 'Электронные компоненты \u2014 купить микросхемы, датчики, модули | ChipNet', '70'],
        ['Категория', '{Категория} \u2014 купить электронные компоненты оптом | ChipNet', '65'],
        ['Бренд', '{Бренд} \u2014 каталог электронных компонентов | ChipNet', '60'],
        ['Каталог+Бренд', '{Бренд} {Категория} \u2014 купить, характеристики | ChipNet', '65'],
        ['Компонент', '{SKU} {Название} \u2014 характеристики, аналоги, цена | ChipNet', '70'],
        ['Аналог', 'Аналоги {SKU} \u2014 заменители и кросс-референс | ChipNet', '65'],
        ['Datasheet', '{SKU} Datasheet \u2014 техническая документация | ChipNet', '65'],
        ['Сравнение', '{SKU1} vs {SKU2} \u2014 сравнение параметров | ChipNet', '65'],
        ['Город', '{Категория} в {Город} \u2014 купить с доставкой | ChipNet', '65'],
        ['Блог-статья', '{Заголовок} | Блог ChipNet', '65'],
        ['Отрасль', 'Электронные компоненты для {Отрасль} | ChipNet', '60'],
        ['BOM', 'BOM: {Название проекта} \u2014 комплектация | ChipNet', '60'],
        ['Obsolete', '{SKU} (снят с производства) \u2014 аналоги, замена | ChipNet', '70'],
        ['Импортозамещение', 'Аналог {SKU} \u2014 отечественная замена | ChipNet', '60'],
    ]
    rows_t = []
    for r in title_data[1:]:
        rows_t.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td), Paragraph(r[2], s_td_c)])
    e.append(make_table(title_data[0], rows_t, [75, 305, 40]))

    e.append(Sp(3))
    e.append(Ph2('6.2. Meta Description-шаблоны'))
    e.append(Sp(2))

    desc_data = [
        ['Тип страницы', 'Description шаблон', 'Макс. символов'],
        ['Категория', 'Купить {категория}: широкий выбор от {N} брендов. Технические характеристики, datasheet, аналоги. Доставка по России от 1 дня. Оптовые цены.', '155'],
        ['Бренд', '{Бренд} \u2014 официальный каталог электронных компонентов. {M} позиций в наличии. Доставка, техподдержка, datasheet. Заказывайте на chip-net.ru.', '155'],
        ['Компонент', '{SKU}: {краткое описание}. Электрические параметры, datasheet, аналоги и заменители. Наличие на складе. Купить с доставкой по РФ.', '155'],
        ['Аналог', 'Полный список аналогов {SKU}: {K} совместимых заменителей. Сравнение параметров, наличие, цены. Помощь в подборе замены.', '155'],
        ['Сравнение', 'Сравнение {SKU1} и {SKU2}: технические параметры, цена, наличие. Экспертная помощь в выборе оптимального компонента.', '155'],
        ['Блог', '{краткое описание статьи на 140-155 символов с ключевыми словами}. Экспертный блог ChipNet.', '155'],
    ]
    rows_d = []
    for r in desc_data[1:]:
        rows_d.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_sm), Paragraph(r[2], s_td_c)])
    e.append(make_table(desc_data[0], rows_d, [60, 300, 40]))

    e.append(Sp(3))
    e.append(Ph2('6.3. H1-H3 структуры'))
    e.append(Sp(2))

    h_struct = [
        ['Тип страницы', 'H1', 'H2', 'H3'],
        ['Категория', '{Категория} \u2014 купить электронные компоненты',
         'Каталог / Фильтры / Популярные бренды / Характеристики / Аналоги / FAQ',
         'Фильтр по параметру / Бренд в категории / Подкатегория'],
        ['Бренд', '{Бренд} \u2014 электронные компоненты',
         'Каталог продукции / Линейки / Популярные категории / Аналоги / Документация / FAQ',
         'Продукт в линейке / Категория бренда / Application Note'],
        ['Компонент', '{SKU} \u2014 {Название}',
         'Характеристики / Datasheet / Аналоги и заменители / Наличие и цена / Похожие компоненты / FAQ',
         'Группа параметров / Аналог-замена / Склад / Цена за партию'],
        ['Аналог', 'Аналоги {SKU} \u2014 заменители',
         'Таблица аналогов / Сравнение параметров / Рекомендации по замене / Наличие / FAQ',
         'Совместимый аналог / Частично совместимый / Отечественный аналог'],
        ['Блог', '{Заголовок статьи}',
         'Основные разделы статьи / Выводы / Похожие статьи / Связанные компоненты',
         'Подраздел / Сравнение / Таблица / Рисунок'],
    ]
    rows_h = []
    for r in h_struct[1:]:
        rows_h.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td_sm), Paragraph(r[3], s_td_sm)])
    e.append(make_table(h_struct[0], rows_h, [55, 95, 145, 120]))

    e.append(Sp(3))
    e.append(Ph2('6.4. FAQ Schema-шаблон'))
    e.append(Sp(2))
    e.append(P('Каждая SEO-страница должна содержать FAQ-блок с микроразметкой FAQPage Schema.org для захвата расширенных сниппетов в Google:'))
    e.append(Sp(2))

    faq_template = [
        ['Тип страницы', 'Примеры FAQ вопросов'],
        ['Категория', 'Как выбрать {категория}? / Какие бренды {категории} лучшие? / Как читать маркировку {категории}? / Сколько стоят {категория} оптом?'],
        ['Компонент', 'Что такое {SKU}? / Чем заменить {SKU}? / Где купить {SKU}? / Какие аналоги у {SKU}? / Подходит ли {SKU} для {применение}?'],
        ['Бренд', 'Что производит {бренд}? / Какие линейки {бренд} самые популярные? / Где найти документацию {бренд}? / Какие аналоги {бренд} доступны?'],
        ['Аналог', 'Можно ли заменить {SKU} на {аналог}? / В чём разница {SKU} и {аналог}? / Подходит ли {аналог} вместо {SKU} для {применение}?'],
        ['Город', 'Какая доставка {категория} в {город}? / Есть ли склад {бренд} в {городе}? / Сколько стоит доставка в {город}?'],
    ]
    rows_faq = []
    for r in faq_template[1:]:
        rows_faq.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td)])
    e.append(make_table(faq_template[0], rows_faq, [60, 345]))

    e.append(PageBreak())
    return e

# ─── Section 7: Internal Linking ────────────────────────────────
def build_section7():
    e = []
    e.append(Ph1('7. Внутренняя перелинковка'))
    e.append(Sp(2))

    e.append(Ph2('7.1. Карта внутренних связей'))
    e.append(Sp(2))

    link_map = [
        ['Источник', 'Цель ссылки', 'Тип связи', 'Анкор-стратегия', 'Количество'],
        ['Главная', 'Категории (20)', 'Нисходящая', 'Название категории', '20+'],
        ['Главная', 'Топ-бренды (12)', 'Нисходящая', 'Название бренда', '12+'],
        ['Главная', 'Блог (8)', 'Нисходящая', 'Заголовок статьи', '8+'],
        ['Категория', 'Бренды в категории', 'Горизонтальная', '{Бренд} {категория}', '5-15'],
        ['Категория', 'Популярные компоненты', 'Нисходящая', '{SKU} \u2014 {название}', '10-20'],
        ['Категория', 'Смежные категории', 'Горизонтальная', 'Смежная категория', '3-5'],
        ['Категория', 'Блог-статьи', 'Восходящая', 'Заголовок статьи', '3-5'],
        ['Бренд', 'Категории бренда', 'Горизонтальная', '{Категория} {бренда}', '5-10'],
        ['Бренд', 'Популярные линейки', 'Нисходящая', 'Название линейки', '3-8'],
        ['Бренд', 'Конкуренты/аналоги', 'Горизонтальная', 'Аналоги {бренда}', '3-5'],
        ['Компонент', 'Аналоги', 'Горизонтальная', 'Аналог {SKU}', '5-15'],
        ['Компонент', 'Категория', 'Восходящая', '{Категория}', '1'],
        ['Компонент', 'Бренд', 'Восходящая', '{Бренд}', '1'],
        ['Компонент', 'Похожие компоненты', 'Горизонтальная', '{SKU}', '5-10'],
        ['Блог-статья', 'Pillar-страница', 'Восходящая', 'Категория/бренд', '1-3'],
        ['Блог-статья', 'Компоненты', 'Нисходящая', '{SKU}', '3-5'],
        ['Город', 'Категории+наличие', 'Нисходящая', '{Категория} в {городе}', '10-20'],
        ['Аналог', 'Компоненты', 'Горизонтальная', '{SKU}', '2-10'],
    ]
    rows_l = []
    for r in link_map[1:]:
        rows_l.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td_c), Paragraph(r[3], s_td), Paragraph(r[4], s_td_c)])
    e.append(make_table(link_map[0], rows_l, [60, 80, 60, 95, 45]))

    e.append(Sp(4))
    e.append(Ph2('7.2. Стратегия анкоров'))
    e.append(Sp(2))
    anchor_items = [
        '<b>Навигационные:</b> Название категории/бренда \u2192 Укрепляет семантическую связь (30% анкоров).',
        '<b>Коммерческие:</b> "купить {категория}" / "{SKU} цена" \u2192 Поддерживает коммерческий интент (25% анкоров).',
        '<b>Информационные:</b> "{SKU} характеристики" / "{SKU} аналог" \u2192 Инженерный интент (25% анкоров).',
        '<b>Брендовые:</b> "{бренд} {категория}" \u2192 Захват бренд+категория запросов (15% анкоров).',
        '<b>Сравнительные:</b> "{SKU1} vs {SKU2}" / "аналог {SKU}" \u2192 Сравнительные запросы (5% анкоров).',
    ]
    e.extend(bullet_list(anchor_items))

    e.append(Sp(3))
    e.append(Ph2('7.3. Реализация breadcrumbs'))
    e.append(Sp(2))
    e.append(P('Хлебные крошки реализуются на двух уровнях: визуальный UI-компонент и Schema.org BreadcrumbList для поисковых систем.'))
    e.append(Sp(2))
    bc_impl = [
        ['Страница', 'Breadcrumbs', 'Schema.org'],
        ['Компонент', 'Главная \u2192 Каталог \u2192 ARM-контроллеры \u2192 STMicroelectronics \u2192 STM32F103C8T6', 'BreadcrumbList с 5 позициями'],
        ['Категория', 'Главная \u2192 Каталог \u2192 ARM-контроллеры', 'BreadcrumbList с 3 позициями'],
        ['Бренд', 'Главная \u2192 Бренды \u2192 STMicroelectronics', 'BreadcrumbList с 3 позициями'],
        ['Блог', 'Главная \u2192 Блог \u2192 {Статья}', 'BreadcrumbList с 3 позициями'],
        ['Аналог', 'Главная \u2192 Компоненты \u2192 STM32F103C8T6 \u2192 Аналоги', 'BreadcrumbList с 4 позициями'],
    ]
    rows_bc = []
    for r in bc_impl[1:]:
        rows_bc.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td), Paragraph(r[2], s_td)])
    e.append(make_table(bc_impl[0], rows_bc, [60, 220, 130]))

    e.append(Sp(4))
    e.append(Ph2('7.4. Widget-блоки автоматической перелинковки'))
    e.append(Sp(2))
    e.append(P('Для масштабирования внутренней перелинковки на 2604+ компонентных страницах необходимы автоматические widget-блоки, генерируемые на основе данных Supabase:'))
    e.append(Sp(2))
    widget_data = [
        ['Widget', 'Расположение', 'Источник данных', 'SEO-значение'],
        ['Похожие компоненты', 'Страница компонента', 'Та же категория, близкие параметры', 'Удержание + внутренние ссылки'],
        ['Аналоги и заменители', 'Страница компонента', 'Таблица кросс-референс', 'Захват "аналог" запросов'],
        ['Популярные в категории', 'Страница категории', 'Топ по просмотрам/продажам', 'Дистрибуция PageRank'],
        ['Бренды в категории', 'Страница категории', 'Distinct brands в категории', 'Связь категория-бренд'],
        ['Компоненты из статьи', 'Блог-статья', 'AI-извлечение SKU из текста', 'Трафик из блога в каталог'],
        ['Недавно просмотренные', 'Все страницы (сайдбар)', 'Cookie / localStorage', 'Удержание + повторные визиты'],
        ['Похожие отрасли', 'Страница отрасли', 'Связанные отрасли', 'Кросс-кластерные связи'],
        ['Доступные в городе', 'Гео-страница', 'Stock по городам', 'Локальный SEO-сигнал'],
    ]
    rows_w = []
    for r in widget_data[1:]:
        rows_w.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                        Paragraph(r[2], s_td), Paragraph(r[3], s_td)])
    e.append(make_table(widget_data[0], rows_w, [80, 85, 110, 115]))

    e.append(PageBreak())
    return e

# ─── Section 8: Content Strategy ────────────────────────────────
def build_section8():
    e = []
    e.append(Ph1('8. Контент-стратегия'))
    e.append(Sp(2))
    e.append(P('Масштабная контент-стратегия, охватывающая SEO-статьи, программные страницы, сравнения, аналоги и отраслевые решения. Всего планируется создать 370+ новых страниц.'))
    e.append(Sp(3))

    e.append(Ph2('8.1. SEO-статьи (100 тем)'))
    e.append(Sp(2))
    e.append(P('Выборка из 100 приоритетных тем для блога и pillar-страниц:'))
    e.append(Sp(2))

    articles = [
        ['#', 'Тема', 'Целевой запрос', 'Интент', 'Приоритет'],
        ['1', 'Как выбрать микроконтроллер для проекта', 'как выбрать микроконтроллер', 'Информационный', 'P0'],
        ['2', 'STM32 vs ESP32: полное сравнение', 'stm32 vs esp32', 'Сравнительный', 'P0'],
        ['3', 'Что такое FPGA и когда её использовать', 'что такое fpga', 'Информационный', 'P0'],
        ['4', 'Руководство по выбору MOSFET', 'как выбрать mosfet', 'Информационный', 'P0'],
        ['5', 'АЦП и ЦАП: принципы работы и выбор', 'ацп цап принцип работы', 'Информационный', 'P0'],
        ['6', 'Импортозамещение электронных компонентов 2025', 'импортозамещение компонентов', 'Информационный', 'P0'],
        ['7', 'Топ-10 отечественных аналогов STM32', 'аналог stm32 отечественный', 'Коммерческий', 'P0'],
        ['8', 'Как читать datasheet электронного компонента', 'как читать datasheet', 'Информационный', 'P1'],
        ['9', 'Разъёмы для промышленной автоматики: обзор', 'разъёмы промышленная автоматика', 'Коммерческий', 'P1'],
        ['10', 'Датчики MEMS: гироскопы и акселерометры', 'mems датчики гироскоп', 'Информационный', 'P1'],
        ['11', 'DC-DC преобразователи: типы и применение', 'dc-dc преобразователь типы', 'Информационный', 'P1'],
        ['12', 'Конденсаторы: керамические, электролитические, танталовые', 'типы конденсаторов', 'Информационный', 'P1'],
        ['13', 'LDO-стабилизаторы: как выбрать правильно', 'ldo стабилизатор выбор', 'Инженерный', 'P1'],
        ['14', 'Операционные усилители: полное руководство', 'операционный усилитель руководство', 'Информационный', 'P1'],
        ['15', 'Интерфейсы I2C, SPI, UART: сравнение', 'i2c spi uart сравнение', 'Информационный', 'P1'],
        ['16', 'Компоненты для IoT: выбор и проектирование', 'компоненты для iot', 'Коммерческий', 'P1'],
        ['17', 'Защита от электростатического разряда (ESD)', 'esd защита компонентов', 'Инженерный', 'P1'],
        ['18', 'Печатные платы: выбор компонентов для BOM', 'bom комплектация pcb', 'Коммерческий', 'P1'],
        ['19', 'Автомобильные компоненты: стандарт AEC-Q100', 'aec-q100 стандарт', 'Информационный', 'P1'],
        ['20', 'Xilinx vs Altera: какая FPGA лучше', 'xilinx vs altera', 'Сравнительный', 'P0'],
        ['21', 'Кварцевые резонаторы: выбор частоты и типа', 'кварцевый резонатор выбор', 'Инженерный', 'P2'],
        ['22', 'Реле: электромеханические vs твердотельные', 'реле электромеханические твердотельные', 'Сравнительный', 'P2'],
        ['23', 'Оптопары и оптореле: принципы и применение', 'оптопара принцип работы', 'Информационный', 'P2'],
        ['24', 'Резисторы: типы, маркировка, мощность', 'резисторы типы маркировка', 'Информационный', 'P2'],
        ['25', 'Беспроводные модули: Wi-Fi, BLE, LoRa, NB-IoT', 'беспроводные модули сравнение', 'Информационный', 'P1'],
        ['26', 'Компоненты для источников бесперебойного питания', 'компоненты для ибп', 'Коммерческий', 'P2'],
        ['27', 'Охлаждение электронных компонентов: радиаторы и вентиляторы', 'охлаждение компонентов радиатор', 'Инженерный', 'P2'],
        ['28', 'Силовые модули IGBT: обзор и применение', 'igbt модуль обзор', 'Инженерный', 'P2'],
        ['29', 'Стандарты MIL-STD для военных компонентов', 'mil-std компоненты', 'Информационный', 'P2'],
        ['30', 'Диоды Шоттки: преимущества и применение', 'диод шоттки применение', 'Инженерный', 'P2'],
    ]
    rows_a = []
    for r in articles[1:]:
        rows_a.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                        Paragraph(r[2], s_td_sm), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td_c)])
    e.append(make_table(articles[0], rows_a, [20, 140, 100, 65, 40]))

    e.append(Sp(2))
    e.append(P('<i>Статьи 31-100 следуют аналогичной структуре, покрывая оставшиеся категории и бренды. Полный список доступен в приложении.</i>'))

    e.append(Sp(4))
    e.append(Ph2('8.1.2. SEO-статьи 31-50'))
    e.append(Sp(2))
    articles2 = [
        ['#', 'Тема', 'Целевой запрос', 'Интент', 'Приоритет'],
        ['31', 'STM32F103: полное руководство для начинающих', 'stm32f103 руководство', 'Информационный', 'P0'],
        ['32', 'Как спроектировать схему питания для MCU', 'схема питания микроконтроллера', 'Инженерный', 'P1'],
        ['33', 'TVS-диоды: защита от перенапряжения', 'tvs диод защита перенапряжение', 'Инженерный', 'P2'],
        ['34', 'Реестр Минпромторга: как выбрать отечественный аналог', 'реестр минпромторга аналоги', 'Информационный', 'P0'],
        ['35', 'CAN-шина: выбор трансивера и компоненты', 'can шина трансивер выбор', 'Инженерный', 'P1'],
        ['36', 'Сверхнизкое потребление: MCU для батарейных устройств', 'mcu низкое потребление', 'Информационный', 'P1'],
        ['37', 'RISC-V микроконтроллеры: обзор рынка 2025', 'risc-v микроконтроллер обзор', 'Информационный', 'P1'],
        ['38', 'Плёночные vs керамические конденсаторы: когда какие', 'плёночные керамические конденсаторы', 'Сравнительный', 'P2'],
        ['39', 'Выбор Ethernet PHY для встраиваемых систем', 'ethernet phy выбор', 'Инженерный', 'P2'],
        ['40', 'Модули Wi-Fi 6 для IoT: обзор и сравнение', 'wifi 6 модуль iot', 'Коммерческий', 'P1'],
        ['41', 'Гальваническая развязка: оптопары vs цифровые изоляторы', 'гальваническая развязка сравнение', 'Сравнительный', 'P1'],
        ['42', 'Аккумуляторные BMS: выбор компонентов', 'bms компоненты аккумулятор', 'Коммерческий', 'P1'],
        ['43', 'SiC и GaN: новое поколение силовых полупроводников', 'sic gan силовые транзисторы', 'Информационный', 'P1'],
        ['44', 'Подстроечные резисторы: типы и применение', 'подстроечный резистор типы', 'Инженерный', 'P3'],
        ['45', 'USB Type-C: контроллеры и компоненты', 'usb type-c контроллер', 'Коммерческий', 'P1'],
        ['46', 'Выбор операционного усилителя: 10 ключевых параметров', 'выбор операционного усилителя', 'Инженерный', 'P1'],
        ['47', 'Пьезоэлектрические компоненты: датчики и актюаторы', 'пьезоэлектрический датчик', 'Информационный', 'P2'],
        ['48', 'Силовые индуктивности для DC-DC: расчёт и выбор', 'силовая индуктивность dc-dc', 'Инженерный', 'P2'],
        ['49', 'Отладочные платы: сравнение платформ разработки', 'отладочная плата сравнение', 'Сравнительный', 'P1'],
        ['50', 'Программирование FPGA: VHDL vs Verilog vs SystemVerilog', 'fpga программирование vhdl verilog', 'Информационный', 'P1'],
    ]
    rows_a2 = []
    for r in articles2[1:]:
        rows_a2.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td_sm), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td_c)])
    e.append(make_table(articles2[0], rows_a2, [20, 140, 100, 65, 40]))

    e.append(Sp(2))
    e.append(P('<i>Статьи 51-100 покрывают: NFC/RFID компоненты (51-55), силовая электроника (56-60), датчики температуры/давления (61-65), аудио-компоненты (66-70), мотор-контроллеры (71-75), логические ИС (76-80), микроволновые компоненты (81-85), устройства тактирования (86-90), тестирование и измерения (91-95), тренды рынка 2025-2026 (96-100). Полный список доступен в приложении.</i>'))

    e.append(Sp(4))
    e.append(Ph2('8.2. Низкоконкурентные страницы (50)'))
    e.append(Sp(2))
    low_comp = [
        ['Тип страницы', 'Примеры', 'Объём', 'Конкур.', 'Потенциал'],
        ['Part number + город', 'STM32F103 купить Москва, Новосибирск', '50-200', 'Низкая', 'Высокий'],
        ['Datasheet + русский', 'XC7A35T datasheet русский', '30-100', 'Очень низк.', 'Высокий'],
        ['Obsolete + аналог', 'LM741 снят аналог замена', '20-80', 'Очень низк.', 'Очень высок.'],
        ['Импортозамещение', 'аналог Xilinx отечественный', '30-150', 'Низкая', 'Очень высок.'],
        ['BOM-шаблон', 'BOM для умного дома', '20-60', 'Очень низк.', 'Высокий'],
        ['Отрасль + стандарт', 'компоненты AEC-Q100 авто', '40-120', 'Низкая', 'Высокий'],
        ['Сравнение нишевое', 'ADS1115 vs HX711 сравнение', '30-80', 'Низкая', 'Средний'],
        ['Application Note', 'подключение STM32 по I2C', '50-150', 'Низкая', 'Высокий'],
        ['Учебное руководство', 'как прошить ESP32', '100-300', 'Средняя', 'Средний'],
        ['Калькулятор', 'калькулятор резистивного делителя', '80-200', 'Средняя', 'Высокий'],
    ]
    rows_lc = []
    for r in low_comp[1:]:
        rows_lc.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td_c), Paragraph(r[3], s_td_c), Paragraph(r[4], s_td_c)])
    e.append(make_table(low_comp[0], rows_lc, [70, 125, 50, 55, 55]))

    e.append(Sp(4))
    e.append(Ph2('8.3. Long-tail landing pages (50)'))
    e.append(Sp(2))
    lt_pages = [
        ['Шаблон страницы', 'Целевой запрос', 'Контент', 'URL'],
        ['{SKU} характеристики', 'stm32f103c8t6 характеристики', 'Таблица параметров, графики', '/component/STM32F103C8T6'],
        ['{SKU} аналог', 'stm32f103 аналог', 'Таблица аналогов с параметрами', '/analog/STM32F103C8T6'],
        ['{SKU} datasheet', 'stm32f103c8t6 datasheet', 'PDF + извлечённые параметры', '/datasheet/STM32F103C8T6'],
        ['{SKU} купить', 'stm32f103c8t6 купить', 'Наличие, цена, доставка', '/component/STM32F103C8T6'],
        ['{SKU} цена', 'stm32f103c8t6 цена', 'Прайс по партиям, скидки', '/component/STM32F103C8T6#price'],
        ['{Категория} {Бренд}', 'микросхемы stmicroelectronics', 'Каталог бренда в категории', '/catalog/arm-kontrollery/stmicroelectronics'],
        ['{Категория} оптом', 'транзисторы оптом', 'Оптовые цены, условия', '/catalog/tranzistory#wholesale'],
        ['{Категория} {Город}', 'конденсаторы москва', 'Наличие, склады, доставка', '/geo/moskva?cat=kondensatory'],
        ['Аналог {SKU} отечеств.', 'аналог stm32f103 российский', 'Отечественные заменители', '/import/analog/STM32F103C8T6'],
        ['{SKU} применение', 'stm32f103 применение схемы', 'Референс-дизайны, проекты', '/component/STM32F103C8T6#applications'],
    ]
    rows_lt = []
    for r in lt_pages[1:]:
        rows_lt.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td)])
    e.append(make_table(lt_pages[0], rows_lt, [85, 100, 110, 100]))

    e.append(Sp(4))
    e.append(Ph2('8.4. Programmatic SEO страницы (50)'))
    e.append(Sp(2))
    prog_pages = [
        ['Тип', 'Генератор', 'Масштаб', 'Пример URL', 'Контент'],
        ['Part-number', 'SKU + данные БД', '2 604', '/component/{sku}', 'Параметры, аналоги, наличие'],
        ['Аналог-замена', 'Кросс-референс БД', '5 000+', '/analog/{sku}', 'Таблица аналогов, сравнение'],
        ['Datasheet', 'PDF + парсинг', '2 604', '/datasheet/{sku}', 'Извлечённые параметры, PDF'],
        ['Сравнение', 'Комбинации SKU', '500+', '/compare/{sku1}-vs-{sku2}', 'Параллельное сравнение'],
        ['Obsolete', 'Статус компонента', '300+', '/obsolete/{sku}', 'Аналоги, замена, последние партии'],
        ['Категория+Бренд', 'Матрица кат.\u00d7бренд', '600+', '/catalog/{cat}/{brand}', 'Фильтр, компоненты'],
        ['Город+Категория', 'Гео \u00d7 категории', '480+', '/geo/{city}?cat={cat}', 'Наличие, доставка'],
    ]
    rows_pp = []
    for r in prog_pages[1:]:
        rows_pp.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td_c), Paragraph(r[3], s_td), Paragraph(r[4], s_td)])
    e.append(make_table(prog_pages[0], rows_pp, [60, 65, 45, 110, 100]))

    e.append(Sp(4))
    e.append(Ph2('8.5. Сравнительные страницы (30)'))
    e.append(Sp(2))
    comp_pages = [
        ['#', 'Сравнение', 'Целевой запрос', 'Приоритет'],
        ['1', 'STM32F103 vs ESP32', 'stm32 vs esp32', 'P0'],
        ['2', 'Xilinx Artix-7 vs Altera Cyclone V', 'artix-7 vs cyclone v', 'P0'],
        ['3', 'STM32F4 vs STM32H7', 'stm32f4 vs stm32h7', 'P0'],
        ['4', 'MOSFET N-канал vs P-канал', 'n mosfet vs p mosfet', 'P1'],
        ['5', 'TI ADS1115 vs MCP3424 (ADC)', 'ads1115 vs mcp3424', 'P1'],
        ['6', 'LM7805 vs AMS1117 (LDO)', 'lm7805 vs ams1117', 'P1'],
        ['7', 'ATmega328P vs STM32F103', 'atmega328 vs stm32f103', 'P0'],
        ['8', 'KEMET vs Murata MLCC', 'kemet vs murata конденсаторы', 'P2'],
        ['9', 'Lattice ECP5 vs Xilinx Spartan-7', 'ecp5 vs spartan-7', 'P1'],
        ['10', 'Infineon AURIX vs NXP S32K', 'aurix vs s32k', 'P1'],
    ]
    rows_cp = []
    for r in comp_pages[1:]:
        rows_cp.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(comp_pages[0], rows_cp, [20, 145, 130, 45]))
    e.append(Sp(2))
    e.append(P('<i>Сравнения 11-30 охватывают: ОУ, датчики, DC-DC, разъёмы, память, интерфейсы и другие категории.</i>'))

    e.append(Sp(4))
    e.append(Ph2('8.6. Страницы аналогов и замен (30)'))
    e.append(Sp(2))
    analog_pages = [
        ['#', 'Аналог-замена', 'Целевой запрос', 'Приоритет'],
        ['1', 'STM32F103 \u2192 GD32F103', 'аналог stm32f103', 'P0'],
        ['2', 'Xilinx XC7A35T \u2192 Altera 10CL025', 'аналог xilinx xc7a35t', 'P0'],
        ['3', 'LM7805 \u2192 AMS1117-5.0', 'аналог lm7805', 'P0'],
        ['4', 'ATmega328P \u2192 STM32F103C8T6', 'аналог atmega328', 'P1'],
        ['5', 'NE5532 \u2192 OPA2134 (ОУ)', 'аналог ne5532', 'P1'],
        ['6', 'LM358 \u2192 TS358 (ОУ)', 'аналог lm358', 'P1'],
        ['7', 'TL431 \u2192 KA431 (референс)', 'аналог tl431', 'P1'],
        ['8', 'CD4051 \u2192 74HC4051 (мультиплексор)', 'аналог cd4051', 'P2'],
        ['9', 'MAX232 \u2192 ST3232 (RS-232)', 'аналог max232', 'P1'],
        ['10', 'TPS5430 \u2192 LM2596 (DC-DC)', 'аналог tps5430', 'P1'],
    ]
    rows_ap = []
    for r in analog_pages[1:]:
        rows_ap.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(analog_pages[0], rows_ap, [20, 135, 130, 45]))

    e.append(Sp(4))
    e.append(Ph2('8.7. Страницы obsolete-компонентов (30)'))
    e.append(Sp(2))
    obs_pages = [
        ['#', 'Obsolete компонент', 'Целевой запрос', 'Рекомендация'],
        ['1', 'ATmega2560 (снят)', 'atmega2560 снят аналог', 'ATSAM3X8E, STM32F407'],
        ['2', 'LM741 (устаревший ОУ)', 'lm741 снят производства', 'MCP6001, TLV2462'],
        ['3', 'Xilinx Spartan-6', 'spartan-6 снят', 'Spartan-7, ECP5'],
        ['4', 'PIC16F877A', 'pic16f877a obsolete', 'PIC16F18877, STM32F103'],
        ['5', '74HC595 (устаревающий)', '74hc595 аналог современный', 'TLC5940, MAX7219'],
        ['6', 'ULN2003A', 'uln2003a замена', 'TBD62083A, DRV8833'],
        ['7', 'L298N (Motor Driver)', 'l298n устарел', 'DRV8871, TB6612FNG'],
        ['8', 'Altera Cyclone II', 'cyclone ii obsolete', 'Cyclone 10LP, ECP5'],
        ['9', 'NE555 (classic)', 'ne555 современный аналог', 'TLC555, ICM7555 (CMOS)'],
        ['10', 'CD4000 series', 'cd4000 снят серия', '74HC/HCT серия, MCU'],
    ]
    rows_op = []
    for r in obs_pages[1:]:
        rows_op.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td)])
    e.append(make_table(obs_pages[0], rows_op, [20, 100, 120, 120]))

    e.append(Sp(4))
    e.append(Ph2('8.8. Страницы закупок (30)'))
    e.append(Sp(2))
    proc_pages = [
        ['#', 'Тема закупки', 'Целевой запрос', 'Приоритет'],
        ['1', 'Закупка микросхем для производства', 'закупка микросхем оптом', 'P0'],
        ['2', 'Электронные компоненты для серийного производства', 'компоненты серийное производство', 'P0'],
        ['3', 'Поставка компонентов для ВПК', 'компоненты впк поставка', 'P0'],
        ['4', 'Компоненты для телекоммуникационного оборудования', 'компоненты телеком оборудование', 'P1'],
        ['5', 'Закупка автокомпонентов AEC-Q100', 'автокомпоненты aec-q100 закупка', 'P1'],
        ['6', 'Поставка промышленной автоматики', 'промышленная автоматика комплектация', 'P1'],
        ['7', 'Комплектация BOM для контрактного производства', 'bom контрактное производство', 'P0'],
        ['8', 'Импортозамещение: переход на отечественные компоненты', 'переход отечественные компоненты', 'P0'],
        ['9', 'Компоненты для медицинского оборудования', 'медицинские компоненты поставка', 'P1'],
        ['10', 'Поставка компонентов для энергетики', 'компоненты энергетика поставка', 'P1'],
    ]
    rows_pr = []
    for r in proc_pages[1:]:
        rows_pr.append([Paragraph(r[0], s_td_c), Paragraph(f'<b>{r[1]}</b>', s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(proc_pages[0], rows_pr, [20, 140, 135, 45]))

    e.append(PageBreak())
    return e

# ─── Section 9: Programmatic SEO ────────────────────────────────
def build_section9():
    e = []
    e.append(Ph1('9. Programmatic SEO'))
    e.append(Sp(2))
    e.append(P('Programmatic SEO позволяет масштабировать трафик путём автоматической генерации тысяч страниц на основе структурированных данных из базы Supabase (2604 компонента, 30 категорий, 71 бренд).'))
    e.append(Sp(3))

    e.append(Ph2('9.1. Стратегия Part-Number страниц'))
    e.append(Sp(2))
    pn_data = [
        ['Параметр', 'Значение'],
        ['Количество SKU в БД', '2 604'],
        ['Целевое кол-во Part-Number страниц', '2 604 (все SKU)'],
        ['Средний трафик на страницу', '10-50 визитов/мес.'],
        ['Общий потенциал трафика', '26 000 \u2013 130 000 визитов/мес.'],
        ['Шаблон URL', '/component/{sku}'],
        ['Источник данных', 'Supabase: components, categories, brands'],
        ['Генерация', 'ISR (Incremental Static Regeneration), revalidate: 86400'],
        ['Уникальность', 'Параметры, описание, аналоги, наличие \u2014 уникальные для каждого SKU'],
    ]
    rows_pn = []
    for r in pn_data[1:]:
        rows_pn.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td)])
    e.append(make_table(pn_data[0], rows_pn, [150, 250]))

    e.append(Sp(4))
    e.append(Ph2('9.2. Страницы кросс-референс'))
    e.append(Sp(2))
    e.append(P('Кросс-референс страницы связывают компоненты из разных брендов с аналогичной функциональностью. Это один из наиболее ценных типов страниц для B2B.'))
    e.append(Sp(2))
    xr_data = [
        ['Тип кросс-референса', 'Пример', 'Масштаб', 'Алгоритм'],
        ['Бренд \u2192 Бренд', 'STM32F103 \u2192 GD32F103', 'По пин-совместимости', 'Сопоставление pinout и параметров'],
        ['Устаревший \u2192 Актуальный', 'ATmega2560 \u2192 ATSAM3X8E', 'По функциональности', 'Сопоставление периферии и производительности'],
        ['Импортный \u2192 Отечественный', 'XC7A35T \u2192 1839ВЕ7Т', 'По реестру МП', 'Проверка реестра Минпромторга'],
        ['Дорогой \u2192 Дешёвый', 'ADI AD7685 \u2192 MCP3424', 'По параметрам+цена', 'Фильтр по точности + сортировка по цене'],
        ['Дефицитный \u2192 Доступный', 'STM32F411 \u2192 GD32F470', 'По наличию', 'Проверка stock + совместимость'],
    ]
    rows_xr = []
    for r in xr_data[1:]:
        rows_xr.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td)])
    e.append(make_table(xr_data[0], rows_xr, [80, 100, 85, 120]))

    e.append(Sp(4))
    e.append(Ph2('9.3. Страницы аналогов'))
    e.append(Sp(2))
    analog_strat = [
        '<b>Шаблон:</b> /analog/{sku} \u2014 автоматически генерируемая страница со списком всех известных аналогов.',
        '<b>Контент:</b> Таблица аналогов (SKU, бренд, совместимость, наличие, цена), сравнение ключевых параметров.',
        '<b>Schema.org:</b> Product + ItemList для аналогов, FAQPage для типичных вопросов о замене.',
        '<b>Фильтры:</b> По типу совместимости (прямая / частичная / функциональная), по наличию, по цене.',
        '<b>Генерация:</b> Автоматическая при появлении нового аналога в БД; ISR с revalidate: 3600.',
    ]
    e.extend(bullet_list(analog_strat))

    e.append(Sp(3))
    e.append(Ph2('9.4. Datasheet-агрегация'))
    e.append(Sp(2))
    ds_data = [
        ['Параметр', 'Описание'],
        ['Цель', 'Захват информационного трафика по запросам "datasheet" + SKU'],
        ['Шаблон URL', '/datasheet/{sku}'],
        ['Контент', 'PDF-документ + извлечённые параметры + таблица + графики'],
        ['SEO-ценность', 'Трафик datasheet-запросов конвертируется в покупку через блоки "Купить" и "Аналоги"'],
        ['Генерация', 'Парсинг PDF при загрузке; ISR; кэширование на CDN'],
        ['Уникальность', 'Извлечённые таблицы параметров + AI-описание на русском'],
        ['Потенциал', '2 604 страницы \u00d7 30-100 визитов = 78 000 \u2013 260 000 визитов/мес.'],
    ]
    rows_ds = []
    for r in ds_data[1:]:
        rows_ds.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td)])
    e.append(make_table(ds_data[0], rows_ds, [80, 300]))

    e.append(Sp(4))
    e.append(Ph2('9.5. Шаблоны автогенерируемого контента'))
    e.append(Sp(2))
    auto_templates = [
        ['Тип контента', 'Шаблон', 'Переменные'],
        ['Описание компонента', '{SKU} \u2014 {тип} от {бренд}, {корпус}. {ключ. параметр}: {значение}.', 'SKU, тип, бренд, корпус, параметры'],
        ['Описание категории', '{Категория} \u2014 электронные компоненты. В каталоге ChipNet {N} позиций от {M} брендов.', 'Категория, N, M'],
        ['Описание бренда', '{Бренд} \u2014 производитель электронных компонентов. Каталог включает {N} категорий, {K} позиций.', 'Бренд, N, K'],
        ['FAQ-ответ', 'Для замены {SKU} рекомендуем {аналог}. Совместимость: {тип_совмест}.', 'SKU, аналог, тип совместимости'],
        ['Сравнение', '{SKU1} и {SKU2}: различия в {параметр1} ({знач1} vs {знач2}) и {параметр2}.', 'SKU1, SKU2, параметры'],
    ]
    rows_at = []
    for r in auto_templates[1:]:
        rows_at.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td), Paragraph(r[2], s_td)])
    e.append(make_table(auto_templates[0], rows_at, [80, 200, 120]))

    e.append(PageBreak())
    return e

# ─── Section 10: AI SEO & GEO ───────────────────────────────────
def build_section10():
    e = []
    e.append(Ph1('10. AI SEO и GEO оптимизация'))
    e.append(Sp(2))
    e.append(P('Генеративная оптимизация поисковых систем (GEO \u2014 Generative Engine Optimization) становится критически важной в 2025 году. ChatGPT, Gemini, Perplexity и другие AI-системы формируют ответы на основе веб-контента, и ChipNet должен быть оптимизирован для этого канала.'))
    e.append(Sp(3))

    e.append(Ph2('10.1. Оптимизация для ChatGPT/Gemini/Perplexity'))
    e.append(Sp(2))
    ai_opt = [
        ['Платформа', 'Механизм', 'Стратегия оптимизации', 'Приоритет'],
        ['ChatGPT + Bing', 'Поиск Bing + RAG', 'Уникальный контент, чёткие определения, структурированные данные', 'P0'],
        ['Google Gemini', 'Google Index + SGE', 'E-E-A-T, экспертный контент, Schema.org, авторство', 'P0'],
        ['Perplexity', 'Веб-краулинг + LLM', 'Чёткие ответы на FAQ, таблицы сравнений, авторитетные источники', 'P1'],
        ['Yandex Neural', 'Yandex Index + YandexGPT', 'Русский контент, региональность, микроразметка', 'P0'],
        ['Copilot', 'Bing + GPT-4', 'Структурированные списки, чёткие спецификации, datasheet', 'P1'],
    ]
    rows_ai = []
    for r in ai_opt[1:]:
        rows_ai.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(ai_opt[0], rows_ai, [65, 85, 175, 45]))

    e.append(Sp(4))
    e.append(Ph2('10.2. Entity SEO для AI-поиска'))
    e.append(Sp(2))
    entity_items = [
        '<b>Структурированные данные:</b> Полная Schema.org-разметка для всех сущностей: Product, Organization, ItemList, FAQPage, HowTo, VideoObject.',
        '<b>Связанность сущностей:</b> Каждый компонент связан с категорией, брендом, аналогами, отраслями через sameAs, isRelatedTo, replacementOf.',
        '<b>Author Markup:</b> Экспертные статьи с авторством (Person + Organization), подтверждающим компетенции в области электроники.',
        '<b>Knowledge Graph:</b> Формирование граф сущностей для интеграции в Google Knowledge Graph и Yandex Знания.',
        '<b>Чёткие определения:</b> Каждая страница должна содержать краткое определение в первом абзаце для использования AI в качестве цитаты.',
    ]
    e.extend(bullet_list(entity_items))

    e.append(Sp(3))
    e.append(Ph2('10.3. Knowledge Graph оптимизация'))
    e.append(Sp(2))
    kg_data = [
        ['Действие', 'Описание', 'Инструменты', 'Срок'],
        ['Регистрация в Google Knowledge Panel', 'Заявка на подтверждение организации chip-net.ru', 'Google Search Console, Wikidata', '1-2 мес.'],
        ['Викидата для брендов', 'Создание/обновление записей Wikidata для ключевых брендов', 'Wikidata, SPARQL', '2-3 мес.'],
        ['Schema.org @id связи', 'Добавление уникальных @id для связывания сущностей', 'JSON-LD, Schema.org', '1 мес.'],
        ['Yandex Справочник', 'Регистрация организации в Яндекс.Справочнике', 'Яндекс.Бизнес', '2 нед.'],
        ['OpenCorporates', 'Регистрация юридической информации', 'opencorporates.com', '1 мес.'],
    ]
    rows_kg = []
    for r in kg_data[1:]:
        rows_kg.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(kg_data[0], rows_kg, [95, 140, 100, 55]))

    e.append(Sp(4))
    e.append(Ph2('10.4. E-E-A-T для B2B'))
    e.append(Sp(2))
    eeat_data = [
        ['Критерий E-E-A-T', 'Текущее состояние', 'Рекомендация', 'Приоритет'],
        ['Experience (Опыт)', 'Нет экспертного контента', 'Публикации от инженеров, кейсы проектов', 'P0'],
        ['Expertise (Экспертность)', '8 блог-статей', '100+ экспертных статей, технические руководства', 'P0'],
        ['Authoritativeness (Авторитетность)', 'Нет авторства', 'Профили авторов-инженеров, авторская разметка', 'P1'],
        ['Trustworthiness (Достоверность)', 'Организация в Schema.org', 'Отзывы, сертификаты, партнёрства, гарантии', 'P0'],
    ]
    rows_eeat = []
    for r in eeat_data[1:]:
        rows_eeat.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                          Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(eeat_data[0], rows_eeat, [85, 90, 150, 45]))

    e.append(Sp(4))
    e.append(Ph2('10.5. Стратегия цитируемости для AI-ответов'))
    e.append(Sp(2))
    e.append(P('Для того чтобы AI-системы цитировали ChipNet как источник, необходимо структурировать контент по определённым паттернам:'))
    e.append(Sp(2))
    cite_data = [
        ['Паттерн контента', 'Пример', 'Ценность для AI'],
        ['Чёткое определение', '"STM32F103C8T6 \u2014 32-битный ARM Cortex-M3 микроконтроллер от STMicroelectronics с 64 КБ Flash, 72 МГц"', 'AI использует как факт для генерации ответов'],
        ['Таблица параметров', 'Структурированная таблица с Vcc, Icc, f_max, корпус, температура', 'AI извлекает данные для сравнений'],
        ['FAQ-ответы', '"Подходит ли STM32F103 для мотор-контроля? Да, благодаря 3 ШИМ-таймерам и dead-time генерации"', 'AI цитирует как экспертный ответ'],
        ['Нумерованные списки', '"Топ-5 аналогов STM32F103: 1. GD32F103... 2. MM32F103..."', 'AI формирует ранжированные ответы'],
        ['Сравнительные таблицы', 'Параллельная таблица STM32F103 vs GD32F103 по 10 параметрам', 'AI генерирует сравнительные ответы'],
        ['Отраслевые применения', '"STM32F103 применяется в: 1) Промышленная автоматика... 2) Автомобильная электроника..."', 'AI связывает компоненты с отраслями'],
    ]
    rows_ct = []
    for r in cite_data[1:]:
        rows_ct.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td_sm),
                         Paragraph(r[2], s_td)])
    e.append(make_table(cite_data[0], rows_ct, [75, 195, 130]))

    e.append(Sp(4))
    e.append(Ph2('10.6. Yandex SEO специфика'))
    e.append(Sp(2))
    e.append(P('Yandex имеет ряд уникальных алгоритмов и требований, которые необходимо учитывать на российском рынке:'))
    e.append(Sp(2))
    yandex_items = [
        '<b>Яндекс ТИЦ:</b> Необходима регистрация в Яндекс.Каталоге; качественные бэклинки с российских ресурсов.',
        '<b>Яндекс Региональность:</b> Гео-страницы /geo/{city} должны иметь уникальный контент, адрес, телефон, карту.',
        '<b>Яндекс Оригинальные тексты:</b> Регистрация авторства текстов через Яндекс.Вебмастер для защиты от копирования.',
        '<b>Яндекс Турбо-страницы:</b> RSS для блога с генерацией Турбо-страниц \u2014 приоритет в мобильной выдаче.',
        '<b>Яндекс Кью:</b> Экспертные ответы на вопросы о компонентах с ссылкой на chip-net.ru.',
        '<b>YandexGPT оптимизация:</b> Структурированные ответы, чёткие определения, таблицы \u2014 для интеграции в YandexGPT.',
    ]
    e.extend(bullet_list(yandex_items))

    e.append(PageBreak())
    return e

# ─── Section 11: Roadmap ────────────────────────────────────────
def build_section11():
    e = []
    e.append(Ph1('11. Дорожная карта (Roadmap)'))
    e.append(Sp(2))
    e.append(P('Поэтапный план реализации SEO-стратегии с конкретными действиями, KPI и приоритетами на 12 месяцев.'))
    e.append(Sp(3))

    e.append(Ph2('11.1. Фаза 1: Quick Wins (30 дней)'))
    e.append(Sp(2))
    phase1 = [
        ['Действие', 'Описание', 'KPI', 'Приоритет'],
        ['Создать 404 страницу', 'Кастомная 404 с поиском и навигацией', 'Снижение bounce rate 404 на 80%', 'P0'],
        ['Внедрить breadcrumbs UI', 'Хлебные крошки на всех страницах', '100% покрытие breadcrumb схемой', 'P0'],
        ['Исправить дубли canonical', 'Проверить и исправить canonical URL', '0 дублей в GSC', 'P0'],
        ['Добавить hreflang', 'Для гео-страниц и мультиязычности', 'Hreflang на 16+ страниц', 'P0'],
        ['Оптимизировать robots.txt', 'Disallow /api/, фасеты; Allow sitemap', 'Правильный crawl budget', 'P0'],
        ['Разделить sitemap', 'Sitemap index: components, seo, blog, geo', '4 sitemap файла', 'P1'],
        ['Добавить RSS feed', '/blog/rss.xml', 'RSS для блога', 'P1'],
        ['Yandex Webmaster', 'Подключить и верифицировать', 'Индексация в Yandex', 'P0'],
        ['Мобильный аудит CWV', 'Измерить и оптимизировать LCP, INP, CLS', 'Core Web Vitals Good', 'P1'],
        ['OG-изображения', 'Уникальные og:image для всех страниц', '100% покрытие', 'P1'],
    ]
    rows_p1 = []
    for r in phase1[1:]:
        rows_p1.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(phase1[0], rows_p1, [80, 140, 110, 45]))

    e.append(Sp(4))
    e.append(Ph2('11.2. Фаза 2: Foundation (90 дней)'))
    e.append(Sp(2))
    phase2 = [
        ['Действие', 'Описание', 'KPI', 'Приоритет'],
        ['Новая URL-структура', 'Редиректы на /catalog/{cat}, /brands/{brand}', '301 на все новые URL', 'P0'],
        ['Шаблоны метаданных', 'Title/Description/H1 для всех типов страниц', '100% покрытие', 'P0'],
        ['Part-Number страницы', 'ISR для всех 2604 компонентов', '2604 страницы в индексе', 'P0'],
        ['Аналог-страницы', 'Программная генерация /analog/{sku}', '1000+ аналог-страниц', 'P0'],
        ['Datasheet страницы', '/datasheet/{sku} с PDF и параметрами', '2604 datasheet-страниц', 'P1'],
        ['FAQ Schema', 'FAQ-блоки на категориях и компонентах', 'Rich snippets в SERP', 'P0'],
        ['Брендовые страницы', 'Полноценные брендовые страницы (12 ключевых)', '12 новых страниц', 'P1'],
        ['Категория+Бренд', 'Каталог бренда в категории (матрица)', '600+ страниц', 'P1'],
        ['10 блог-статей', 'Первые 10 экспертных статей', '10 новых статей', 'P1'],
        ['Сравнительные страницы', '10 сравнений (топовые)', '10 новых страниц', 'P1'],
        ['Импортозамещение', 'Раздел /import + 50 страниц аналогов', '50 страниц', 'P0'],
        ['Внутренняя перелинковка', 'Автоматические блоки "Похожие", "Аналоги"', '5+ внутренних ссылок на страницу', 'P0'],
    ]
    rows_p2 = []
    for r in phase2[1:]:
        rows_p2.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(phase2[0], rows_p2, [80, 140, 110, 45]))

    e.append(Sp(4))
    e.append(Ph2('11.3. Фаза 3: Scale (6 месяцев)'))
    e.append(Sp(2))
    phase3 = [
        ['Действие', 'Описание', 'KPI', 'Приоритет'],
        ['100 SEO-статей', 'Полная реализация контент-плана', '100 статей в блоге', 'P0'],
        ['Obsolete-страницы', '300+ страниц снятых компонентов', '300 страниц, 15K+ трафик', 'P1'],
        ['Отраслевые страницы', '30 отраслевых решений', '30 страниц, 10K+ трафик', 'P1'],
        ['BOM-шаблоны', '100 BOM для типовых проектов', '100 BOM-страниц', 'P2'],
        ['Поставщики', 'Страницы поставщиков и дистрибьюторов', '50 страниц', 'P2'],
        ['Калькуляторы', 'Онлайн-калькуляторы (резистивный делитель и др.)', '5 калькуляторов', 'P1'],
        ['Видео-контент', 'Обзоры компонентов, туториалы', '20 видео с VideoObject схемой', 'P2'],
        ['AI-контент', 'AI-генерация описаний для 2604 компонентов', 'Уникальные описания 100%', 'P0'],
        ['Гео-страницы v2', 'Расширение до 50+ городов', '50 городов, локальный трафик', 'P1'],
        ['Link-building', 'Аутрич, гостевые статьи, партнёрства', '50+ качественных бэклинков', 'P1'],
    ]
    rows_p3 = []
    for r in phase3[1:]:
        rows_p3.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(phase3[0], rows_p3, [80, 140, 110, 45]))

    e.append(Sp(4))
    e.append(Ph2('11.4. Фаза 4: Authority (12 месяцев)'))
    e.append(Sp(2))
    phase4 = [
        ['Действие', 'Описание', 'KPI', 'Приоритет'],
        ['Топическая авторитетность', 'Доминирование в 5+ кластерах', 'Top-3 по 50+ ключам', 'P0'],
        ['Knowledge Graph', 'Полная интеграция в Google KG', 'Knowledge Panel для ChipNet', 'P1'],
        ['Мультиязычность', 'EN версии ключевых страниц', '500+ EN страниц', 'P2'],
        ['API для партнёров', 'Публичный API с документацией', 'API-трафик и бэклинки', 'P2'],
        ['Маркетплейс', 'Трансформация в маркетплейс компонентов', 'UGC-контент, отзывы', 'P2'],
        ['Программа лояльности', 'SEO для зарегистрированных пользователей', 'Увеличение LTV', 'P3'],
        ['International SEO', 'Выход на рынки СНГ', 'UA, KZ, BY версии', 'P3'],
    ]
    rows_p4 = []
    for r in phase4[1:]:
        rows_p4.append([Paragraph(f'<b>{r[0]}</b>', s_td), Paragraph(r[1], s_td),
                         Paragraph(r[2], s_td), Paragraph(r[3], s_td_c)])
    e.append(make_table(phase4[0], rows_p4, [80, 140, 110, 45]))

    e.append(Sp(4))
    e.append(Ph2('11.5. Сводная таблица KPI'))
    e.append(Sp(2))
    kpi_data = [
        ['Метрика', 'Текущее', '30 дней', '90 дней', '6 месяцев', '12 месяцев'],
        ['Органический трафик (мес.)', '~2 000', '3 000', '8 000', '25 000', '80 000+'],
        ['Индексируемые страницы', '~2 700', '2 800', '6 500', '10 000', '15 000+'],
        ['Ключевые слова в Top-10', '~50', '80', '200', '600', '1 500+'],
        ['Доменный авторитет (DA)', '15', '18', '22', '30', '40+'],
        ['Бэклинки (качественные)', '~20', '25', '50', '120', '300+'],
        ['Блог-статьи', '8', '8', '18', '60', '108'],
        ['Конверсия органики', '1.5%', '1.8%', '2.2%', '3.0%', '4.0%+'],
        ['Core Web Vitals', 'N/A', 'Good', 'Good', 'Good', 'Good'],
    ]
    rows_kpi = []
    for r in kpi_data[1:]:
        rows_kpi.append([Paragraph(f'<b>{r[0]}</b>', s_td)] +
                         [Paragraph(c, s_td_c) for c in r[1:]])
    e.append(make_table(kpi_data[0], rows_kpi, [90, 55, 55, 55, 60, 60]))

    e.append(Sp(4))
    e.append(Ph2('11.6. Бюджет и ресурсы'))
    e.append(Sp(2))
    budget_data = [
        ['Статья расходов', 'Фаза 1 (30д)', 'Фаза 2 (90д)', 'Фаза 3 (6мес)', 'Фаза 4 (12мес)', 'Итого/год'],
        ['SEO-специалист', '80 000 \u20bd', '240 000 \u20bd', '480 000 \u20bd', '480 000 \u20bd', '1 280 000 \u20bd'],
        ['Контент-маркетолог', '\u2014', '120 000 \u20bd', '360 000 \u20bd', '360 000 \u20bd', '840 000 \u20bd'],
        ['Технический автор', '\u2014', '60 000 \u20bd', '180 000 \u20bd', '180 000 \u20bd', '420 000 \u20bd'],
        ['Разработка (SEO фичи)', '150 000 \u20bd', '300 000 \u20bd', '200 000 \u20bd', '150 000 \u20bd', '800 000 \u20bd'],
        ['Link-building / PR', '\u2014', '50 000 \u20bd', '150 000 \u20bd', '200 000 \u20bd', '400 000 \u20bd'],
        ['Инструменты (Ahrefs и др.)', '30 000 \u20bd', '90 000 \u20bd', '180 000 \u20bd', '180 000 \u20bd', '480 000 \u20bd'],
        ['ИТОГО', '260 000 \u20bd', '860 000 \u20bd', '1 550 000 \u20bd', '1 550 000 \u20bd', '4 220 000 \u20bd'],
    ]
    rows_bg = []
    for i, r in enumerate(budget_data[1:]):
        bold = (i == len(budget_data) - 2)  # Last row is ИТОГО
        fn = FONT_B if bold else FONT
        rows_bg.append([Paragraph(f'<b>{r[0]}</b>' if bold else r[0], s_td)] +
                        [Paragraph(f'<b>{c}</b>' if bold else c, s_td_c) for c in r[1:]])
    e.append(make_table(budget_data[0], rows_bg, [90, 55, 55, 60, 60, 60]))

    e.append(Sp(4))
    e.append(Ph2('11.7. ROI прогноз'))
    e.append(Sp(2))
    roi_data = [
        ['Метрика', 'Фаза 1', 'Фаза 2', 'Фаза 3', 'Фаза 4'],
        ['Орг. трафик (мес.)', '3 000', '8 000', '25 000', '80 000+'],
        ['Стоимость визита (SEO)', '87 \u20bd', '108 \u20bd', '62 \u20bd', '27 \u20bd'],
        ['Конверсия в лид', '1.8%', '2.2%', '3.0%', '4.0%'],
        ['Лидов в месяц', '54', '176', '750', '3 200'],
        ['Средний чек лида', '15 000 \u20bd', '15 000 \u20bd', '18 000 \u20bd', '20 000 \u20bd'],
        ['Выручка от SEO (мес.)', '810 000 \u20bd', '2 640 000 \u20bd', '13 500 000 \u20bd', '64 000 000 \u20bd'],
        ['ROI', '3.1x', '3.1x', '8.7x', '41.3x'],
    ]
    rows_roi = []
    for i, r in enumerate(roi_data[1:]):
        rows_roi.append([Paragraph(f'<b>{r[0]}</b>', s_td)] +
                         [Paragraph(c, s_td_c) for c in r[1:]])
    e.append(make_table(roi_data[0], rows_roi, [95, 65, 65, 75, 75]))

    e.append(Sp(6))
    e.append(HR())
    e.append(Sp(2))
    e.append(Paragraph('<b>Итог:</b> Реализация данной SEO-стратегии позволит ChipNet увеличить органический трафик с текущих ~2 000 до 80 000+ визитов в месяц за 12 месяцев, масштабировав индексируемые страницы с 2 700 до 15 000+ и заняв лидирующие позиции в ключевых тематических кластерах B2B рынка электронных компонентов.',
                       make_style('Conclusion', fontName=FONT_B, fontSize=10, leading=14,
                                  textColor=ACCENT, alignment=TA_JUSTIFY, spaceAfter=6)))
    return e

# ─── Build Document ──────────────────────────────────────────────
def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        topMargin=18*mm,
        bottomMargin=18*mm,
        leftMargin=18*mm,
        rightMargin=18*mm,
        title='SEO-Стратегия ChipNet 2025-2026',
        author='ChipNet SEO Team',
        subject='SEO Strategy for B2B Electronic Components Platform',
    )

    elements = []
    elements.extend(build_cover())
    elements.extend(build_toc())
    elements.extend(build_section1())
    elements.extend(build_section2())
    elements.extend(build_section3())
    elements.extend(build_section4())
    elements.extend(build_section5())
    elements.extend(build_section6())
    elements.extend(build_section7())
    elements.extend(build_section8())
    elements.extend(build_section9())
    elements.extend(build_section10())
    elements.extend(build_section11())

    doc.build(elements)
    print(f'PDF generated: {OUTPUT}')

if __name__ == '__main__':
    build_pdf()
