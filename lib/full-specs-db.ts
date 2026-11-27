// lib/full-specs-db.ts
// Курируемая база полных технических параметров популярных компонентов.
// Данные собраны из официальных даташитов производителей (TI, ST, NXP, Onsemi,
// Microchip, Broadcom, Bosch, Yageo, Murata, TDK, Vishay и др.) и публичных
// каталогов (Digikey, Mouser, Octopart).
//
// Поиск по точному совпадению SKU (case-insensitive).
// Применяется ПЕРЕД rule-based экстрактором extractSpecs().

import { Spec } from './extract-specs';

type Entry = {
  sku: string;            // точное совпадение (case-insensitive)
  category?: string;      // категория (для дедупликации)
  specs: Spec[];          // полный список параметров
};

// ───────────────────────────────────────────────────────────────────────────────
// ОПЕРАЦИОННЫЕ УСИЛИТЕЛИ
// ───────────────────────────────────────────────────────────────────────────────

const OP_AMPS: Entry[] = [
  {
    sku: 'NE5532P', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Операц. усилитель (низкий шум, аудио)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Скорость нарастания', value: '9 В/мкс' },
      { label: 'Полоса пропускания', value: '10 МГц' },
      { label: 'Напряжение питания', value: '±5…±15 В (10…30 В)' },
      { label: 'Ток потребления', value: '8 мА (на 2 канала)' },
      { label: 'Входной ток смещения', value: '200 нА' },
      { label: 'Входное напряжение шума', value: '5 нВ/√Гц' },
      { label: 'Выходной ток', value: '38 мА' },
      { label: 'CMRR', value: '100 дБ' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'NE5532DR', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Операц. усилитель (низкий шум, аудио)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Скорость нарастания', value: '9 В/мкс' },
      { label: 'Полоса пропускания', value: '10 МГц' },
      { label: 'Напряжение питания', value: '±5…±15 В' },
      { label: 'Ток потребления', value: '8 мА' },
      { label: 'Входное напряжение шума', value: '5 нВ/√Гц' },
      { label: 'Корпус', value: 'SOIC-8' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'LM358', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments / ON Semiconductor' },
      { label: 'Тип', value: 'Операц. усилитель (general purpose, low power)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Полоса пропускания', value: '1 МГц' },
      { label: 'Скорость нарастания', value: '0.5 В/мкс' },
      { label: 'Напряжение питания', value: '3…32 В (однополярное) / ±1.5…±16 В' },
      { label: 'Ток потребления', value: '0.7 мА' },
      { label: 'Входной ток смещения', value: '20 нА' },
      { label: 'Входное напряжение смещения', value: '2 мВ' },
      { label: 'Выходной ток', value: '20…40 мА' },
      { label: 'CMRR', value: '85 дБ' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'LM358P', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Двойной операционный усилитель (low power)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Полоса пропускания', value: '1 МГц' },
      { label: 'Скорость нарастания', value: '0.5 В/мкс' },
      { label: 'Напряжение питания', value: '3…32 В' },
      { label: 'Ток потребления', value: '0.7 мА' },
      { label: 'Корпус', value: 'DIP-8' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'LM358N', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor' },
      { label: 'Тип', value: 'Двойной операционный усилитель (low power)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Полоса пропускания', value: '1 МГц' },
      { label: 'Напряжение питания', value: '3…32 В' },
      { label: 'Корпус', value: 'DIP-8' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'LM324', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Квад-операционный усилитель (low power)' },
      { label: 'Количество каналов', value: '4' },
      { label: 'Полоса пропускания', value: '1.2 МГц' },
      { label: 'Напряжение питания', value: '3…32 В' },
      { label: 'Ток потребления', value: '1.4 мА' },
      { label: 'Корпус', value: 'DIP-14 / SOIC-14' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'TL072', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Операц. усилитель (JFET вход, низкий шум)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Полоса пропускания', value: '3 МГц' },
      { label: 'Скорость нарастания', value: '13 В/мкс' },
      { label: 'Напряжение питания', value: '±5…±18 В' },
      { label: 'Входной ток смещения', value: '65 пА (JFET)' },
      { label: 'Входное напряжение шума', value: '18 нВ/√Гц' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'TL074', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Квад-ОУ с JFET входом' },
      { label: 'Количество каналов', value: '4' },
      { label: 'Полоса пропускания', value: '3 МГц' },
      { label: 'Скорость нарастания', value: '13 В/мкс' },
      { label: 'Напряжение питания', value: '±5…±18 В' },
      { label: 'Корпус', value: 'DIP-14 / SOIC-14' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'LM393', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Двойной компаратор (low power, low offset)' },
      { label: 'Количество каналов', value: '2' },
      { label: 'Напряжение питания', value: '2…36 В (однополярное)' },
      { label: 'Ток потребления', value: '0.4 мА' },
      { label: 'Время отклика', value: '1.3 мкс' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C' },
    ],
  },
  {
    sku: 'LM339', category: 'Операционные усилители',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Квад-компаратор' },
      { label: 'Количество каналов', value: '4' },
      { label: 'Напряжение питания', value: '2…36 В' },
      { label: 'Корпус', value: 'DIP-14 / SOIC-14' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// СТАБИЛИЗАТОРЫ
// ───────────────────────────────────────────────────────────────────────────────

const REGULATORS: Entry[] = [
  {
    sku: 'LM7805', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments / STMicroelectronics' },
      { label: 'Тип', value: 'Линейный положительный стабилизатор' },
      { label: 'Выходное напряжение', value: '+5 В' },
      { label: 'Макс. выходной ток', value: '1 А (с радиатором)' },
      { label: 'Входное напряжение', value: '7…35 В' },
      { label: 'Падение напряжения', value: '2 В' },
      { label: 'Ток потребления (quiescent)', value: '5 мА' },
      { label: 'Точность', value: '±2% / ±4%' },
      { label: 'Защита', value: 'От перегрева и КЗ' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+125°C' },
    ],
  },
  {
    sku: 'LM7812', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Линейный положительный стабилизатор' },
      { label: 'Выходное напряжение', value: '+12 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Входное напряжение', value: '14.5…35 В' },
      { label: 'Падение напряжения', value: '2 В' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+125°C' },
    ],
  },
  {
    sku: 'LM7905', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Линейный отрицательный стабилизатор' },
      { label: 'Выходное напряжение', value: '-5 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Входное напряжение', value: '-7…-35 В' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'LM317', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Линейный регулируемый стабилизатор (положительный)' },
      { label: 'Выходное напряжение', value: '1.25…37 В (регулируемое)' },
      { label: 'Макс. выходной ток', value: '1.5 А' },
      { label: 'Входное напряжение', value: 'до 40 В' },
      { label: 'Падение напряжения', value: '3 В' },
      { label: 'Ток регулировки', value: '50 мкА' },
      { label: 'Опорное напряжение', value: '1.25 В' },
      { label: 'Защита', value: 'От перегрева и КЗ' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+125°C' },
    ],
  },
  {
    sku: 'AMS1117-3.3', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Advanced Monolithic Systems (Hunan) / Diodes Inc' },
      { label: 'Тип', value: 'LDO стабилизатор' },
      { label: 'Выходное напряжение', value: '+3.3 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Входное напряжение', value: '4.5…15 В' },
      { label: 'Падение напряжения', value: '1.2 В (при 1А)' },
      { label: 'Ток потребления', value: '5…10 мА' },
      { label: 'Точность', value: '±1% / ±2%' },
      { label: 'Корпус', value: 'SOT-223' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'AMS1117-5.0', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Advanced Monolithic Systems' },
      { label: 'Тип', value: 'LDO стабилизатор' },
      { label: 'Выходное напряжение', value: '+5.0 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Входное напряжение', value: '6.5…15 В' },
      { label: 'Падение напряжения', value: '1.2 В' },
      { label: 'Корпус', value: 'SOT-223' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'AMS1117-1.8', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Advanced Monolithic Systems' },
      { label: 'Тип', value: 'LDO стабилизатор' },
      { label: 'Выходное напряжение', value: '+1.8 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Корпус', value: 'SOT-223' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'AMS1117-2.5', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Advanced Monolithic Systems' },
      { label: 'Тип', value: 'LDO стабилизатор' },
      { label: 'Выходное напряжение', value: '+2.5 В' },
      { label: 'Макс. выходной ток', value: '1 А' },
      { label: 'Корпус', value: 'SOT-223' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'LM2596', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'DC-DC понижающий преобразователь (Buck)' },
      { label: 'Выходное напряжение', value: '1.25…37 В (регулируемое) / фиксированные версии 3.3/5/12 В' },
      { label: 'Макс. выходной ток', value: '3 А' },
      { label: 'Входное напряжение', value: '4.5…40 В' },
      { label: 'Частота ШИМ', value: '150 кГц' },
      { label: 'КПД', value: 'до 90%' },
      { label: 'Внутренний ключ', value: 'Да (DMOS, 65 мОм)' },
      { label: 'Защита', value: 'От перегрева, от КЗ (current limit)' },
      { label: 'Корпус', value: 'TO-220-5 / TO-263-5' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-40…+125°C' },
    ],
  },
  {
    sku: 'LM2596S-5.0', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'DC-DC понижающий (Buck)' },
      { label: 'Выходное напряжение', value: '+5.0 В' },
      { label: 'Макс. выходной ток', value: '3 А' },
      { label: 'Входное напряжение', value: '7…40 В' },
      { label: 'Частота ШИМ', value: '150 кГц' },
      { label: 'Корпус', value: 'TO-263-5 (D2PAK)' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'MP1584', category: 'Стабилизаторы',
    specs: [
      { label: 'Производитель', value: 'Monolithic Power Systems (MPS)' },
      { label: 'Тип', value: 'DC-DC понижающий (Buck)' },
      { label: 'Выходное напряжение', value: '0.8…28 В (регулируемое)' },
      { label: 'Макс. выходной ток', value: '3 А' },
      { label: 'Входное напряжение', value: '4.5…28 В' },
      { label: 'Частота ШИМ', value: '1.5 МГц (программируемая)' },
      { label: 'КПД', value: 'до 92%' },
      { label: 'Внутренний ключ', value: 'Да (90 мОм)' },
      { label: 'Корпус', value: 'SOIC-8' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+125°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// МИКРОКОНТРОЛЛЕРЫ
// ───────────────────────────────────────────────────────────────────────────────

const MCUS: Entry[] = [
  {
    sku: 'STM32F103C8T6', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'STMicroelectronics' },
      { label: 'Архитектура', value: 'ARM Cortex-M3 (32-bit)' },
      { label: 'Семейство', value: 'STM32F1' },
      { label: 'Тактовая частота', value: '72 МГц' },
      { label: 'Flash-память', value: '64 КБ' },
      { label: 'RAM (SRAM)', value: '20 КБ' },
      { label: 'Напряжение питания', value: '2.0…3.6 В' },
      { label: 'Количество портов I/O', value: '37' },
      { label: 'АЦП', value: '2× 12-bit, 10 каналов' },
      { label: 'ЦАП', value: 'Нет' },
      { label: 'Таймеры', value: '3× 16-bit, 1× 16-bit advanced' },
      { label: 'Интерфейсы', value: '2× I2C, 3× USART, 2× SPI, 1× USB 2.0 FS, 1× CAN' },
      { label: 'Корпус', value: 'LQFP-48' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'STM32F103C6T6', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'STMicroelectronics' },
      { label: 'Архитектура', value: 'ARM Cortex-M3' },
      { label: 'Семейство', value: 'STM32F1' },
      { label: 'Тактовая частота', value: '72 МГц' },
      { label: 'Flash-память', value: '32 КБ' },
      { label: 'RAM (SRAM)', value: '10 КБ' },
      { label: 'Напряжение питания', value: '2.0…3.6 В' },
      { label: 'Количество портов I/O', value: '37' },
      { label: 'Корпус', value: 'LQFP-48' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'STM32F407VET6', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'STMicroelectronics' },
      { label: 'Архитектура', value: 'ARM Cortex-M4F (32-bit, FPU)' },
      { label: 'Семейство', value: 'STM32F4' },
      { label: 'Тактовая частота', value: '168 МГц' },
      { label: 'Flash-память', value: '512 КБ' },
      { label: 'RAM (SRAM)', value: '192 КБ' },
      { label: 'Напряжение питания', value: '1.8…3.6 В' },
      { label: 'Количество портов I/O', value: '82' },
      { label: 'АЦП', value: '3× 12-bit, 24 канала' },
      { label: 'ЦАП', value: '2× 12-bit' },
      { label: 'Интерфейсы', value: '3× I2C, 4× USART, 3× SPI, 1× USB 2.0 FS/HS, 2× CAN, 1× SDIO, ETH' },
      { label: 'Корпус', value: 'LQFP-100' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'ATMEGA328P-PU', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Microchip (Atmel)' },
      { label: 'Архитектура', value: 'AVR 8-bit RISC' },
      { label: 'Семейство', value: 'ATmega' },
      { label: 'Тактовая частота', value: '20 МГц' },
      { label: 'Flash-память', value: '32 КБ' },
      { label: 'RAM (SRAM)', value: '2 КБ' },
      { label: 'EEPROM', value: '1 КБ' },
      { label: 'Напряжение питания', value: '1.8…5.5 В' },
      { label: 'Количество портов I/O', value: '23' },
      { label: 'АЦП', value: '10-bit, 8 каналов' },
      { label: 'Таймеры', value: '2× 8-bit, 1× 16-bit' },
      { label: 'Интерфейсы', value: '1× I2C, 1× USART, 1× SPI' },
      { label: 'Корпус', value: 'DIP-28' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'ATMEGA328P-AU', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Microchip (Atmel)' },
      { label: 'Архитектура', value: 'AVR 8-bit' },
      { label: 'Тактовая частота', value: '20 МГц' },
      { label: 'Flash-память', value: '32 КБ' },
      { label: 'RAM (SRAM)', value: '2 КБ' },
      { label: 'Корпус', value: 'TQFP-32' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'ATMEGA2560-16AU', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Microchip (Atmel)' },
      { label: 'Архитектура', value: 'AVR 8-bit' },
      { label: 'Тактовая частота', value: '16 МГц' },
      { label: 'Flash-память', value: '256 КБ' },
      { label: 'RAM (SRAM)', value: '8 КБ' },
      { label: 'EEPROM', value: '4 КБ' },
      { label: 'Количество портов I/O', value: '86' },
      { label: 'АЦП', value: '16× 10-bit' },
      { label: 'Интерфейсы', value: '2× I2C, 4× USART, 1× SPI' },
      { label: 'Корпус', value: 'TQFP-100' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'ATtiny85', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Microchip (Atmel)' },
      { label: 'Архитектура', value: 'AVR 8-bit' },
      { label: 'Семейство', value: 'ATtiny' },
      { label: 'Тактовая частота', value: '20 МГц' },
      { label: 'Flash-память', value: '8 КБ' },
      { label: 'RAM (SRAM)', value: '512 Б' },
      { label: 'EEPROM', value: '512 Б' },
      { label: 'Напряжение питания', value: '1.8…5.5 В' },
      { label: 'Количество портов I/O', value: '6' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'ESP32-WROOM-32', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Espressif Systems' },
      { label: 'Архитектура', value: 'Xtensa LX6 (32-bit, dual-core)' },
      { label: 'Семейство', value: 'ESP32' },
      { label: 'Тактовая частота', value: '240 МГц' },
      { label: 'Flash-память', value: '4 МБ (внешняя, в модуле)' },
      { label: 'RAM (SRAM)', value: '520 КБ' },
      { label: 'ROM', value: '448 КБ' },
      { label: 'Напряжение питания', value: '2.2…3.6 В' },
      { label: 'Количество портов I/O', value: '22 (через модуль)' },
      { label: 'Беспроводная связь', value: 'Wi-Fi 802.11 b/g/n + BLE 4.2' },
      { label: 'АЦП', value: '2× 12-bit, 18 каналов' },
      { label: 'ЦАП', value: '2× 8-bit' },
      { label: 'Интерфейсы', value: '4× SPI, 2× I2C, 3× UART, 2× I2S, CAN' },
      { label: 'Корпус', value: 'Модуль (SMD)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'ESP8266EX', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'Espressif Systems' },
      { label: 'Архитектура', value: 'Xtensa LX106 (32-bit)' },
      { label: 'Семейство', value: 'ESP8266' },
      { label: 'Тактовая частота', value: '80 МГц (до 160 МГц)' },
      { label: 'Flash-память', value: 'Внешняя (SPI)' },
      { label: 'RAM (SRAM)', value: '80 КБ' },
      { label: 'ROM', value: '32 КБ' },
      { label: 'Напряжение питания', value: '2.5…3.6 В' },
      { label: 'Беспроводная связь', value: 'Wi-Fi 802.11 b/g/n (2.4 ГГц)' },
      { label: 'Количество портов I/O', value: '17' },
      { label: 'Корпус', value: 'QFN-32' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+125°C' },
    ],
  },
  {
    sku: 'CH32V203', category: 'Микроконтроллеры',
    specs: [
      { label: 'Производитель', value: 'WCH (Nanjing Qinheng)' },
      { label: 'Архитектура', value: 'RISC-V (RV32IMAC, 32-bit)' },
      { label: 'Семейство', value: 'CH32' },
      { label: 'Тактовая частота', value: '144 МГц' },
      { label: 'Flash-память', value: '64 КБ' },
      { label: 'RAM (SRAM)', value: '20 КБ' },
      { label: 'Напряжение питания', value: '2.4…3.6 В' },
      { label: 'Корпус', value: 'LQFP-32' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ТРАНЗИСТОРЫ
// ───────────────────────────────────────────────────────────────────────────────

const TRANSISTORS: Entry[] = [
  {
    sku: 'IRFZ44N', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'Infineon / Vishay / ST' },
      { label: 'Тип', value: 'N-канал MOSFET' },
      { label: 'Макс. Uсток-исток (Vds)', value: '55 В' },
      { label: 'Макс. ток стока (Id)', value: '49 А (при 25°C)' },
      { label: 'Rds(on)', value: '17.5 мОм (при Vgs=10В)' },
      { label: 'Пороговое Uзи (Vgs(th))', value: '2…4 В' },
      { label: 'Макс. Uзи (Vgs)', value: '±20 В' },
      { label: 'Заряд затвора (Qg)', value: '67 нКл' },
      { label: 'Мощность рассеяния (Pd)', value: '110 Вт (при 25°C)' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-55…+175°C' },
    ],
  },
  {
    sku: 'IRF540N', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'Infineon / Vishay' },
      { label: 'Тип', value: 'N-канал MOSFET' },
      { label: 'Макс. Uсток-исток', value: '100 В' },
      { label: 'Макс. ток стока', value: '33 А (при 25°C)' },
      { label: 'Rds(on)', value: '44 мОм' },
      { label: 'Пороговое Uзи', value: '2…4 В' },
      { label: 'Заряд затвора', value: '71 нКл' },
      { label: 'Мощность рассеяния', value: '130 Вт' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-55…+175°C' },
    ],
  },
  {
    sku: 'IRF3205', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'Infineon' },
      { label: 'Тип', value: 'N-канал MOSFET' },
      { label: 'Макс. Uсток-исток', value: '55 В' },
      { label: 'Макс. ток стока', value: '110 А' },
      { label: 'Rds(on)', value: '8 мОм' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '2N7000', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / Fairchild' },
      { label: 'Тип', value: 'N-канал MOSFET (малый сигнал)' },
      { label: 'Макс. Uсток-исток', value: '60 В' },
      { label: 'Макс. ток стока', value: '200 мА' },
      { label: 'Rds(on)', value: '5 Ом (при Vgs=10В)' },
      { label: 'Пороговое Uзи', value: '0.8…3 В' },
      { label: 'Корпус', value: 'TO-92' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'BC547', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semi / NXP / ST' },
      { label: 'Тип', value: 'BJT NPN (general purpose, малый сигнал)' },
      { label: 'Макс. Uкэ (Vceo)', value: '45 В' },
      { label: 'Макс. ток коллектора (Ic)', value: '100 мА' },
      { label: 'Коэффициент усиления (hFE)', value: '110…800' },
      { label: 'Граничная частота (fT)', value: '300 МГц' },
      { label: 'Мощность рассеяния', value: '500 мВт' },
      { label: 'Корпус', value: 'TO-92' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-65…+150°C' },
    ],
  },
  {
    sku: 'BC557', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semi / NXP' },
      { label: 'Тип', value: 'BJT PNP (general purpose)' },
      { label: 'Макс. Uкэ', value: '45 В' },
      { label: 'Макс. ток коллектора', value: '100 мА' },
      { label: 'hFE', value: '110…800' },
      { label: 'fT', value: '150…300 МГц' },
      { label: 'Корпус', value: 'TO-92' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'TIP31C', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / ST' },
      { label: 'Тип', value: 'BJT NPN (силовой)' },
      { label: 'Макс. Uкэ', value: '100 В (TIP31C)' },
      { label: 'Макс. ток коллектора', value: '3 А' },
      { label: 'hFE', value: '10…50 (при Ic=1A)' },
      { label: 'Мощность рассеяния', value: '40 Вт (с радиатором)' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'TIP32C', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / ST' },
      { label: 'Тип', value: 'BJT PNP (силовой)' },
      { label: 'Макс. Uкэ', value: '100 В' },
      { label: 'Макс. ток коллектора', value: '3 А' },
      { label: 'hFE', value: '10…50' },
      { label: 'Мощность рассеяния', value: '40 Вт' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '2N2222', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semi / ST / NXP' },
      { label: 'Тип', value: 'BJT NPN (general purpose, switching)' },
      { label: 'Макс. Uкэ', value: '40 В' },
      { label: 'Макс. ток коллектора', value: '600 мА' },
      { label: 'hFE', value: '100…300' },
      { label: 'fT', value: '300 МГц' },
      { label: 'Корпус', value: 'TO-92 (PN2222) / TO-18 (metal)' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '2N3904', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semi / Fairchild' },
      { label: 'Тип', value: 'BJT NPN (general purpose)' },
      { label: 'Макс. Uкэ', value: '40 В' },
      { label: 'Макс. ток коллектора', value: '200 мА' },
      { label: 'hFE', value: '100…300' },
      { label: 'fT', value: '300 МГц' },
      { label: 'Корпус', value: 'TO-92' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '2N3906', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'ON Semi / Fairchild' },
      { label: 'Тип', value: 'BJT PNP (general purpose)' },
      { label: 'Макс. Uкэ', value: '40 В' },
      { label: 'Макс. ток коллектора', value: '200 мА' },
      { label: 'hFE', value: '100…300' },
      { label: 'Корпус', value: 'TO-92' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ДИОДЫ
// ───────────────────────────────────────────────────────────────────────────────

const DIODES: Entry[] = [
  {
    sku: '1N4007', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / Vishay / ST' },
      { label: 'Тип', value: 'Выпрямительный (general purpose)' },
      { label: 'Макс. обратное напряжение (Vr)', value: '1000 В' },
      { label: 'Средний выпрямленный ток (Io)', value: '1 А' },
      { label: 'Прямое падение (Vf)', value: '1.1 В (при 1А)' },
      { label: 'Обратный ток (Ir)', value: '5 мкА' },
      { label: 'Время восстановления (trr)', value: '30 мкс' },
      { label: 'Макс. импульсный ток', value: '30 А (8.3 мс)' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-65…+150°C' },
    ],
  },
  {
    sku: '1N4001', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / Vishay' },
      { label: 'Тип', value: 'Выпрямительный' },
      { label: 'Макс. обратное напряжение', value: '50 В' },
      { label: 'Средний выпрямленный ток', value: '1 А' },
      { label: 'Прямое падение', value: '1.1 В' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N4148', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay / NXP / ON Semi' },
      { label: 'Тип', value: 'Быстрый переключающий (small signal)' },
      { label: 'Макс. обратное напряжение', value: '75 В' },
      { label: 'Средний выпрямленный ток', value: '150 мА' },
      { label: 'Прямое падение', value: '1.0 В (при 10 мА)' },
      { label: 'Время восстановления', value: '4 нс' },
      { label: 'Корпус', value: 'DO-35' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N5819', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / Vishay' },
      { label: 'Тип', value: 'Шоттки (выпрямитель)' },
      { label: 'Макс. обратное напряжение', value: '40 В' },
      { label: 'Средний выпрямленный ток', value: '1 А' },
      { label: 'Прямое падение', value: '0.55 В (при 1А)' },
      { label: 'Время восстановления', value: '<10 нс' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N5822', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor' },
      { label: 'Тип', value: 'Шоттки' },
      { label: 'Макс. обратное напряжение', value: '40 В' },
      { label: 'Средний выпрямленный ток', value: '3 А' },
      { label: 'Прямое падение', value: '0.5 В' },
      { label: 'Корпус', value: 'DO-201AD' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'KBPC608', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor / HY Electronic' },
      { label: 'Тип', value: 'Мостовой однофазный выпрямитель' },
      { label: 'Макс. обратное напряжение', value: '800 В' },
      { label: 'Средний выпрямленный ток', value: '6 А' },
      { label: 'Прямое падение (на мост)', value: '1.1 В (на диод)' },
      { label: 'Корпус', value: 'KBPC (металл-пластик)' },
      { label: 'Тип монтажа', value: 'THT (с теплостоком)' },
      { label: 'Рабочая температура', value: '-55…+150°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ЛОГИКА
// ───────────────────────────────────────────────────────────────────────────────

const LOGIC: Entry[] = [
  {
    sku: '74HC595', category: 'Логика',
    specs: [
      { label: 'Производитель', value: 'NXP / TI / ST' },
      { label: 'Семейство', value: '74HC (High Speed CMOS)' },
      { label: 'Технология', value: 'CMOS' },
      { label: 'Функция', value: '8-битный сдвиговый регистр с защёлкой (SIPO)' },
      { label: 'Напряжение питания', value: '2…6 В' },
      { label: 'Макс. тактовая частота', value: '25 МГц (при 4.5В)' },
      { label: 'Ток потребления (static)', value: '4 мкА (при 25°C)' },
      { label: 'Выходной ток (H/L)', value: '±6 мА (при 4.5В) / ±7.8 мА (при 6В)' },
      { label: 'Входной ток утечки', value: '±1 мкА' },
      { label: 'Корпус', value: 'DIP-16 / SOIC-16 / TSSOP-16' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C / -40…+125°C' },
    ],
  },
  {
    sku: '74HC595D', category: 'Логика',
    specs: [
      { label: 'Производитель', value: 'NXP / TI' },
      { label: 'Семейство', value: '74HC' },
      { label: 'Функция', value: '8-битный сдвиговый регистр' },
      { label: 'Напряжение питания', value: '2…6 В' },
      { label: 'Корпус', value: 'SOIC-16' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: '74HC00', category: 'Логика',
    specs: [
      { label: 'Производитель', value: 'NXP / TI / ST' },
      { label: 'Семейство', value: '74HC' },
      { label: 'Функция', value: '4×2И-НЕ (QUAD 2-INPUT NAND)' },
      { label: 'Напряжение питания', value: '2…6 В' },
      { label: 'Корпус', value: 'DIP-14 / SOIC-14' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: '74HC138', category: 'Логика',
    specs: [
      { label: 'Производитель', value: 'NXP / TI' },
      { label: 'Семейство', value: '74HC' },
      { label: 'Функция', value: 'Декодер 3→8 (3-to-8 line decoder)' },
      { label: 'Напряжение питания', value: '2…6 В' },
      { label: 'Корпус', value: 'DIP-16 / SOIC-16' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ОПТРОНЫ / ОПТОЭЛЕКТРОНИКА
// ───────────────────────────────────────────────────────────────────────────────

const OPTO: Entry[] = [
  {
    sku: 'PC817', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Sharp / Cosmo / LiteOn' },
      { label: 'Тип', value: 'Оптрон (транзисторный выход)' },
      { label: 'Изоляция', value: '5000 Vrms (мин.)' },
      { label: 'CTR (коэф. передачи)', value: '50…600% (PC817C/D)' },
      { label: 'Входное прямое напряжение (Vf)', value: '1.2 В (при 20 мА)' },
      { label: 'Макс. входной ток (If)', value: '50 мА' },
      { label: 'Макс. U коллектор-эмиттер', value: '35 В (Vce)' },
      { label: 'Макс. ток коллектора (Ic)', value: '50 мА' },
      { label: 'Время нарастания/спада', value: '4/3 мкс (при RL=100 Ом)' },
      { label: 'Корпус', value: 'DIP-4 / SMD-4' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-30…+100°C' },
    ],
  },
  {
    sku: 'PC817C', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Sharp / LiteOn' },
      { label: 'Тип', value: 'Оптрон (транзисторный выход)' },
      { label: 'CTR', value: '200…400%' },
      { label: 'Изоляция', value: '5000 Vrms' },
      { label: 'Корпус', value: 'DIP-4' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'MOC3063', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'ON Semi / Vishay' },
      { label: 'Тип', value: 'Оптрон (symmetric triac driver, zero-crossing)' },
      { label: 'Изоляция', value: '5300 Vrms' },
      { label: 'Выход', value: 'Phototriac' },
      { label: 'Макс. U блокировки', value: '600 В (MOC3063)' },
      { label: 'Макс. выходной ток (Itsm)', value: '1 А (импульсный)' },
      { label: 'Нулевой уровень (zero-crossing)', value: 'Да (20 В типично)' },
      { label: 'Корпус', value: 'DIP-6 / SMD-6' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ДАТЧИКИ
// ───────────────────────────────────────────────────────────────────────────────

const SENSORS: Entry[] = [
  {
    sku: 'BME280', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Bosch Sensortec' },
      { label: 'Тип', value: 'Датчик влажности + давления + температуры' },
      { label: 'Интерфейс', value: 'I2C / SPI' },
      { label: 'Диапазон давления', value: '300…1100 гПа (экв. +9000…-500 м)' },
      { label: 'Точность давления', value: '±1 гПа' },
      { label: 'Диапазон температуры', value: '-40…+85°C' },
      { label: 'Точность температуры', value: '±1°C (при 0…65°C)' },
      { label: 'Диапазон влажности', value: '0…100% RH' },
      { label: 'Точность влажности', value: '±3% RH' },
      { label: 'Напряжение питания', value: '1.71…3.6 В (VDD), 1.2…3.6 В (VDDIO)' },
      { label: 'Ток потребления', value: '2.7 мкА (при 1 Гц)' },
      { label: 'Корпус', value: 'LGA-8 (8-контактный, 2.5×2.5×0.93 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'BMP280', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Bosch Sensortec' },
      { label: 'Тип', value: 'Датчик давления + температуры (без влажности)' },
      { label: 'Интерфейс', value: 'I2C / SPI' },
      { label: 'Диапазон давления', value: '300…1100 гПа' },
      { label: 'Точность давления', value: '±0.12 гПа' },
      { label: 'Напряжение питания', value: '1.71…3.6 В' },
      { label: 'Корпус', value: 'LGA-8 (2.0×2.5×0.95 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'DHT11', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Aosong (Guangzhou Aosong Electronics)' },
      { label: 'Тип', value: 'Цифровой датчик влажности + температуры' },
      { label: 'Интерфейс', value: '1-wire (собственный протокол)' },
      { label: 'Диапазон влажности', value: '20…90% RH' },
      { label: 'Точность влажности', value: '±5% RH' },
      { label: 'Диапазон температуры', value: '0…+50°C' },
      { label: 'Точность температуры', value: '±2°C' },
      { label: 'Разрешение', value: '1% RH / 1°C' },
      { label: 'Период опроса', value: '≥1 сек' },
      { label: 'Напряжение питания', value: '3.3…5.5 В' },
      { label: 'Ток потребления', value: '0.3 мА (измерение), 60 мкА (покой)' },
      { label: 'Корпус', value: 'Пластиковый с сеткой (4 пина)' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '0…+50°C' },
    ],
  },
  {
    sku: 'DHT22', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Aosong' },
      { label: 'Тип', value: 'Цифровой датчик влажности + температуры (precision)' },
      { label: 'Интерфейс', value: '1-wire (собственный)' },
      { label: 'Диапазон влажности', value: '0…100% RH' },
      { label: 'Точность влажности', value: '±2% RH (макс.), ±5% RH (в крайних)' },
      { label: 'Диапазон температуры', value: '-40…+80°C' },
      { label: 'Точность температуры', value: '±0.5°C' },
      { label: 'Разрешение', value: '0.1% RH / 0.1°C' },
      { label: 'Период опроса', value: '≥2 сек' },
      { label: 'Напряжение питания', value: '3.3…6 В' },
      { label: 'Корпус', value: 'Пластиковый с сеткой' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'MPU6050', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'InvenSense (TDK)' },
      { label: 'Тип', value: '6-осный IMU (3-оси гироскоп + 3-оси акселерометр)' },
      { label: 'Интерфейс', value: 'I2C (до 400 кГц)' },
      { label: 'Диапазон гироскопа', value: '±250/±500/±1000/±2000 °/с' },
      { label: 'Диапазон акселерометра', value: '±2/±4/±8/±16 g' },
      { label: 'Напряжение питания', value: '2.375…3.46 В (VDD), 1.71 В (VLOGIC)' },
      { label: 'Ток потребления', value: '3.9 мА (гироскоп+аксель)' },
      { label: 'DMP', value: 'Встроенный (Digital Motion Processor)' },
      { label: 'Корпус', value: 'QFN-24 (4×4×0.9 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'HC-SR04', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Разные (Китай)' },
      { label: 'Тип', value: 'Ультразвуковой дальномер' },
      { label: 'Частота ультразвука', value: '40 кГц' },
      { label: 'Дальность измерения', value: '2…400 см' },
      { label: 'Точность', value: '±3 мм' },
      { label: 'Угол обзора', value: '15° (эффективный)' },
      { label: 'Напряжение питания', value: '5 В (DC)' },
      { label: 'Ток потребления', value: '15 мА' },
      { label: 'Интерфейс', value: 'TTL Trigger/Echo (цифровой)' },
      { label: 'Мин. период опроса', value: '50 мс' },
      { label: 'Корпус', value: 'Модуль PCB с 2 пьезоизлучателями' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-15…+60°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ИНТЕРФЕЙСЫ
// ───────────────────────────────────────────────────────────────────────────────

const INTERFACES: Entry[] = [
  {
    sku: 'MAX485', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'Analog Devices (Maxim Integrated)' },
      { label: 'Тип', value: 'Приёмопередатчик RS-485/RS-422 (low-power)' },
      { label: 'Стандарт', value: 'TIA/EIA-485-A, TIA/EIA-422-B' },
      { label: 'Скорость передачи', value: 'до 2.5 Мбит/с' },
      { label: 'Напряжение питания', value: '+5 В (однополярное)' },
      { label: 'Ток потребления', value: '120…500 мкА (без нагрузки)' },
      { label: 'Количество приёмопередатчиков', value: '1 (на кристалле)' },
      { label: 'Макс. узлов в сети', value: '32 (unit load)' },
      { label: 'Защита', value: 'Тепловая защита, КЗ на выходе' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C (коммерч.) / -40…+85°C (industrial)' },
    ],
  },
  {
    sku: 'CP2102', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'Silicon Labs' },
      { label: 'Тип', value: 'USB-UART мост' },
      { label: 'Стандарт USB', value: 'USB 2.0 Full Speed (12 Мбит/с)' },
      { label: 'UART', value: 'до 1 Мбит/с' },
      { label: 'Напряжение питания', value: '3.0…3.6 В (внутр. регулятор от USB 5В)' },
      { label: 'I/O напряжение', value: '1.8…3.3 В' },
      { label: 'GPIO', value: '4 линии (мультиплексируемые)' },
      { label: 'Размер EEPROM', value: 'Внутренняя (для VID/PID/строки)' },
      { label: 'Корпус', value: 'QFN-28 (5×5 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'CH340', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'WCH (Nanjing Qinheng Microelectronics)' },
      { label: 'Тип', value: 'USB-UART мост' },
      { label: 'Стандарт USB', value: 'USB 2.0 Full Speed' },
      { label: 'UART', value: 'до 2 Мбит/с' },
      { label: 'Напряжение питания', value: '5 В (от USB) / 3.3 В (внутр. LDO)' },
      { label: 'I/O напряжение', value: 'TTL 5В / 3.3В (compatible)' },
      { label: 'Корпус', value: 'SOIC-16 (CH340G) / SSOP-20' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C (G версия)' },
    ],
  },
  {
    sku: 'MCP2515', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'Microchip Technology' },
      { label: 'Тип', value: 'CAN-контроллер (со встроенным PHY)' },
      { label: 'Стандарт CAN', value: 'CAN 2.0B (ISO 11898)' },
      { label: 'Скорость CAN', value: 'до 1 Мбит/с' },
      { label: 'Интерфейс к MCU', value: 'SPI (до 10 МГц)' },
      { label: 'Буферы', value: '3× TX, 2× RX' },
      { label: 'Фильтры', value: '2 маски + 6 фильтров' },
      { label: 'Напряжение питания', value: '2.7…5.5 В' },
      { label: 'Ток потребления', value: '5 мА (active), 1 мкА (sleep)' },
      { label: 'Корпус', value: 'DIP-18 / SOIC-18 / TSSOP-20' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-40…+125°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// ПАМЯТЬ
// ───────────────────────────────────────────────────────────────────────────────

const MEMORY: Entry[] = [
  {
    sku: '24LC256', category: 'Память',
    specs: [
      { label: 'Производитель', value: 'Microchip Technology' },
      { label: 'Тип', value: 'EEPROM (последовательная)' },
      { label: 'Объём', value: '256 Кбит (32 КБ × 8 бит)' },
      { label: 'Интерфейс', value: 'I2C (2-wire)' },
      { label: 'Макс. частота шины', value: '400 кГц' },
      { label: 'Напряжение питания', value: '1.7…5.5 В' },
      { label: 'Ток потребления (active)', value: '400 мкА' },
      { label: 'Ток потребления (standby)', value: '1 мкА' },
      { label: 'Время записи страницы', value: '5 мс (макс.)' },
      { label: 'Размер страницы', value: '64 байта' },
      { label: 'Сохранность данных', value: '200 лет' },
      { label: 'Ресурс записи', value: '1 000 000 циклов' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8 / TSSOP-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'AT24C256', category: 'Память',
    specs: [
      { label: 'Производитель', value: 'Microchip (Atmel)' },
      { label: 'Тип', value: 'EEPROM' },
      { label: 'Объём', value: '256 Кбит (32 КБ)' },
      { label: 'Интерфейс', value: 'I2C' },
      { label: 'Корпус', value: 'DIP-8 / SOIC-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'W25Q128', category: 'Память',
    specs: [
      { label: 'Производитель', value: 'Winbond' },
      { label: 'Тип', value: 'Serial Flash (NOR)' },
      { label: 'Объём', value: '128 Мбит (16 МБ)' },
      { label: 'Интерфейс', value: 'SPI (до 104 МГц), Dual-SPI, Quad-SPI' },
      { label: 'Напряжение питания', value: '2.7…3.6 В' },
      { label: 'Ток потребления (active)', value: '25 мА (чтение), 25 мА (запись)' },
      { label: 'Ток потребления (standby)', value: '1 мкА (deep power-down)' },
      { label: 'Сектора', value: '256 (по 4 КБ) + 4 КБ каждый' },
      { label: 'Блоки', value: '32 (по 64 КБ)' },
      { label: 'Сохранность данных', value: '20 лет' },
      { label: 'Ресурс записи', value: '100 000 циклов на сектор' },
      { label: 'Корпус', value: 'SOIC-8 / WSON-8' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// АЦП/ЦАП
// ───────────────────────────────────────────────────────────────────────────────

const ADC_DAC: Entry[] = [
  {
    sku: 'HX711', category: 'АЦП/ЦАП',
    specs: [
      { label: 'Производитель', value: 'Avia Semiconductor' },
      { label: 'Тип', value: '24-битный АЦП для тензодатчиков' },
      { label: 'Разрядность', value: '24 бит' },
      { label: 'Каналы', value: '2 (A: дифференциальный, B: дифференциальный)' },
      { label: 'Коэф. усиления (PGA)', value: '128 / 64 (A), 32 (B)' },
      { label: 'Входное напряжение (full-scale)', value: '±20 мВ (при 5В питании и gain=128)' },
      { label: 'Частота выборки', value: '10 SPS или 80 SPS (программируется)' },
      { label: 'Напряжение питания', value: '2.6…5.5 В (аналоговое), 2.6…5.5 В (цифровое)' },
      { label: 'Ток потребления (active)', value: '1.4 мА' },
      { label: 'Ток потребления (standby)', value: '<1 мкА' },
      { label: 'Интерфейс', value: 'Собственный 2-wire (CLK + DOUT)' },
      { label: 'Корпус', value: 'SOP-16' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'MCP3208', category: 'АЦП/ЦАП',
    specs: [
      { label: 'Производитель', value: 'Microchip' },
      { label: 'Тип', value: '12-битный АЦП (SAR)' },
      { label: 'Разрядность', value: '12 бит' },
      { label: 'Каналы', value: '8 (одноканальный или дифференциальный)' },
      { label: 'Частота выборки', value: 'до 100 kSPS (при 5В)' },
      { label: 'Интерфейс', value: 'SPI (mode 0,0 / 1,1)' },
      { label: 'Напряжение питания', value: '2.7…5.5 В' },
      { label: 'Опорное напряжение', value: 'до VDD' },
      { label: 'Ток потребления (active)', value: '0.5 мА' },
      { label: 'Ток потребления (standby)', value: '1 мкА' },
      { label: 'Корпус', value: 'DIP-16 / SOIC-16' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// РАЗЪЁМЫ (примеры популярных)
// ───────────────────────────────────────────────────────────────────────────────

const CONNECTORS: Entry[] = [
  {
    sku: 'B3F-1022', category: 'Переключатели',
    specs: [
      { label: 'Производитель', value: 'Omron' },
      { label: 'Тип', value: 'Тактовая кнопка (tactile switch)' },
      { label: 'Контактная схема', value: 'SPST-NO (4 пина)' },
      { label: 'Номинальное напряжение', value: '12 В (DC)' },
      { label: 'Номинальный ток', value: '50 мА' },
      { label: 'Контактное сопротивление', value: '100 мОм (макс.)' },
      { label: 'Изоляционное сопротивление', value: '100 МОм (мин., 100В DC)' },
      { label: 'Усилие нажатия', value: '1.27 Н (130 гс)' },
      { label: 'Ход', value: '0.25 мм' },
      { label: 'Ресурс', value: '100 000 нажатий' },
      { label: 'Корпус', value: 'Пластик 6×6 мм' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-25…+70°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Дополнительные диоды (стабилитроны, выпрямители из каталога)
// ───────────────────────────────────────────────────────────────────────────────

const DIODES_EXTRA: Entry[] = [
  {
    sku: '1N4730A', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'STMicroelectronics / Vishay / ON Semi' },
      { label: 'Тип', value: 'Стабилитрон (Zener)' },
      { label: 'Напряжение стабилизации (Vz)', value: '3.9 В (ном.)' },
      { label: 'Допуск Vz', value: '±5%' },
      { label: 'Мощность рассеяния (Pz)', value: '1.0 Вт (при TL=50°C)' },
      { label: 'Макс. импульсный ток (IZM)', value: '253 мА (постоянный)' },
      { label: 'Прямое падение (Vf)', value: '1.2 В (при 200 мА)' },
      { label: 'Обратный ток (Ir)', value: '10 мкА (при 1 В)' },
      { label: 'Динамическое сопротивление (Zzt)', value: '4 Ом (при Izt=76 мА)' },
      { label: 'Ток тестирования (Izt)', value: '76 мА' },
      { label: 'Температурный коэффициент', value: '-0.055 %/°C' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
      { label: 'Рабочая температура', value: '-65…+175°C' },
    ],
  },
  {
    sku: '1N4735A', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay / STMicroelectronics' },
      { label: 'Тип', value: 'Стабилитрон' },
      { label: 'Напряжение стабилизации', value: '6.2 В' },
      { label: 'Допуск', value: '±5%' },
      { label: 'Мощность рассеяния', value: '1.0 Вт' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N4735A-Q1', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay' },
      { label: 'Тип', value: 'Стабилитрон (Automotive AEC-Q101)' },
      { label: 'Напряжение стабилизации', value: '6.2 В' },
      { label: 'Мощность рассеяния', value: '1.0 Вт' },
      { label: 'Сертификация', value: 'AEC-Q101 (Automotive)' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N4760A', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay' },
      { label: 'Тип', value: 'Стабилитрон' },
      { label: 'Напряжение стабилизации', value: '47 В' },
      { label: 'Допуск', value: '±5%' },
      { label: 'Мощность рассеяния', value: '1.0 Вт' },
      { label: 'Корпус', value: 'DO-41' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N5399', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semi / Vishay / Diodes Inc' },
      { label: 'Тип', value: 'Выпрямительный (general purpose)' },
      { label: 'Макс. обратное напряжение', value: '1000 В' },
      { label: 'Средний выпрямленный ток', value: '1.5 А' },
      { label: 'Прямое падение', value: '1.4 В (при 1.5А)' },
      { label: 'Корпус', value: 'DO-15' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: '1N5406', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ON Semiconductor' },
      { label: 'Тип', value: 'Выпрямительный' },
      { label: 'Макс. обратное напряжение', value: '600 В' },
      { label: 'Средний выпрямленный ток', value: '3 А' },
      { label: 'Прямое падение', value: '1.2 В (при 3А)' },
      { label: 'Корпус', value: 'DO-201AD' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'BAT54S', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'ST / NXP / ON Semi' },
      { label: 'Тип', value: 'Шоттки (двойной, последовательно)' },
      { label: 'Макс. обратное напряжение', value: '30 В' },
      { label: 'Средний выпрямленный ток', value: '200 мА' },
      { label: 'Прямое падение', value: '0.32 В (тип., при 1 мА)' },
      { label: 'Корпус', value: 'SOT-23' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'SMBJ24A', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay / Littelfuse / ON Semi' },
      { label: 'Тип', value: 'TVS-супрессор (Transient Voltage Suppressor)' },
      { label: 'Направленность', value: 'Unidirectional (односторонний)' },
      { label: 'Рабочее напряжение (VRWM)', value: '24.4 В' },
      { label: 'Напряжение пробоя (VBR)', value: '26.7 В (мин.) / 29.5 В (макс.)' },
      { label: 'Напряжение фиксации (VC)', value: '38.9 В (макс.)' },
      { label: 'Макс. импульсный ток (IPP)', value: '15.4 А (10/1000 мкс)' },
      { label: 'Мощность импульса (PPPM)', value: '600 Вт (10/1000 мкс)' },
      { label: 'Корпус', value: 'SMB (DO-214AA)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-55…+150°C' },
    ],
  },
  {
    sku: '1.5KE33A', category: 'Диоды',
    specs: [
      { label: 'Производитель', value: 'Vishay / Littelfuse' },
      { label: 'Тип', value: 'TVS-супрессор (Transient Voltage Suppressor)' },
      { label: 'Направленность', value: 'Unidirectional' },
      { label: 'Рабочее напряжение', value: '28.4 В' },
      { label: 'Напряжение пробоя', value: '31.1 В (мин.)' },
      { label: 'Напряжение фиксации', value: '45.7 В' },
      { label: 'Мощность импульса', value: '1500 Вт (10/1000 мкс)' },
      { label: 'Корпус', value: 'DO-201AD' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Дополнительные транзисторы
// ───────────────────────────────────────────────────────────────────────────────

const TRANSISTORS_EXTRA: Entry[] = [
  {
    sku: 'BC857B', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'NXP / Infineon / Vishay' },
      { label: 'Тип', value: 'BJT PNP (малый сигнал)' },
      { label: 'Макс. Uкэ (Vceo)', value: '45 В' },
      { label: 'Макс. ток коллектора', value: '100 мА' },
      { label: 'hFE', value: '220…475 (BC857B)' },
      { label: 'fT', value: '100…300 МГц' },
      { label: 'Мощность рассеяния', value: '330 мВт' },
      { label: 'Корпус', value: 'SOT-23' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-65…+150°C' },
    ],
  },
  {
    sku: 'BDW47C', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'Vishay / STMicroelectronics' },
      { label: 'Тип', value: 'BJT NPN (Darlington, силовой)' },
      { label: 'Макс. Uкэ', value: '80 В (BDW47C)' },
      { label: 'Макс. ток коллектора', value: '15 А' },
      { label: 'hFE', value: '1000 (мин., при 5А)' },
      { label: 'Мощность рассеяния', value: '90 Вт (с радиатором)' },
      { label: 'Корпус', value: 'TO-247' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
  {
    sku: 'IRF1404', category: 'Транзисторы',
    specs: [
      { label: 'Производитель', value: 'Infineon / International Rectifier' },
      { label: 'Тип', value: 'N-канал MOSFET (силовой)' },
      { label: 'Макс. Uсток-исток', value: '40 В' },
      { label: 'Макс. ток стока', value: '162 А (при 25°C)' },
      { label: 'Rds(on)', value: '4.0 мОм (тип., при Vgs=10В)' },
      { label: 'Пороговое Uзи', value: '2…4 В' },
      { label: 'Заряд затвора', value: '160 нКл' },
      { label: 'Мощность рассеяния', value: '200 Вт (с радиатором)' },
      { label: 'Корпус', value: 'TO-220' },
      { label: 'Тип монтажа', value: 'THT' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Дополнительные оптроны
// ───────────────────────────────────────────────────────────────────────────────

const OPTO_EXTRA: Entry[] = [
  {
    sku: 'PC857', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Vishay / Sharp / LiteOn' },
      { label: 'Тип', value: 'Оптрон (транзисторный выход)' },
      { label: 'Изоляция', value: '5000 Vrms' },
      { label: 'CTR', value: '50…600% (по группам A/B/C/D)' },
      { label: 'Входное прямое напряжение', value: '1.2 В (при 20 мА)' },
      { label: 'Макс. входной ток', value: '50 мА' },
      { label: 'Макс. U кэ', value: '35 В' },
      { label: 'Корпус', value: 'DIP-4 / SMD-4' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '-30…+100°C' },
    ],
  },
  {
    sku: '6N139', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Vishay / ON Semi' },
      { label: 'Тип', value: 'Высокоскоростной оптрон (логический выход)' },
      { label: 'Изоляция', value: '5000 Vrms' },
      { label: 'CTR', value: '500% (тип.)' },
      { label: 'Скорость передачи', value: 'до 100 кбод' },
      { label: 'Время отклика', value: '0.2/0.3 мкс' },
      { label: 'Корпус', value: 'DIP-8 / SMD-8' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'MOC3061', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Vishay / ON Semi' },
      { label: 'Тип', value: 'Оптрон (triac driver, zero-crossing)' },
      { label: 'Изоляция', value: '5300 Vrms' },
      { label: 'Макс. U блокировки', value: '600 В (MOC3061/63) / 400 В (MOC3062)' },
      { label: 'Нулевой уровень', value: 'Да (zero-crossing)' },
      { label: 'Корпус', value: 'DIP-6 / SMD-6' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'MOC3081', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Vishay / ON Semi' },
      { label: 'Тип', value: 'Оптрон (triac driver, zero-crossing, 800V)' },
      { label: 'Изоляция', value: '5300 Vrms' },
      { label: 'Макс. U блокировки', value: '800 В' },
      { label: 'Корпус', value: 'DIP-6 / SMD-6' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
    ],
  },
  {
    sku: 'BPW34', category: 'Оптоэлектроника',
    specs: [
      { label: 'Производитель', value: 'Vishay / Osram' },
      { label: 'Тип', value: 'PIN-фотодиод (видимый + ИК)' },
      { label: 'Спектральный диапазон', value: '400…1100 нм (пик 850 нм)' },
      { label: 'Темновой ток', value: '<2 нА (при 10В)' },
      { label: 'Фото-ток', value: '~55 мкА (при 1000 лк, 5В)' },
      { label: 'Время отклика', value: '20 нс (при 5В)' },
      { label: 'Угол обзора', value: '±15°' },
      { label: 'Корпус', value: 'SMD (Side View)' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Дополнительные интерфейсы и память
// ───────────────────────────────────────────────────────────────────────────────

const INTERFACES_MEMORY_EXTRA: Entry[] = [
  {
    sku: 'FT232RL', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'FTDI (Future Technology Devices Intl.)' },
      { label: 'Тип', value: 'USB-UART мост (single chip)' },
      { label: 'Стандарт USB', value: 'USB 2.0 Full Speed (12 Мбит/с)' },
      { label: 'UART', value: 'до 3 Мбит/с' },
      { label: 'Интерфейс к MCU', value: 'UART / FIFO (16 байт TX, 16 байт RX)' },
      { label: 'Напряжение питания', value: '4.0…5.25 В (внутр. 3.3В регулятор)' },
      { label: 'I/O напряжение', value: '3.3 В (внутр. LDO)' },
      { label: 'EEPROM', value: 'Внутренняя (для VID/PID/serial)' },
      { label: 'GPIO', value: '4 (CBUS0-3, мультиплексируемые)' },
      { label: 'Корпус', value: 'SSOP-28' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'MAX3232', category: 'Интерфейсы',
    specs: [
      { label: 'Производитель', value: 'Analog Devices (Maxim Integrated)' },
      { label: 'Тип', value: 'Приёмопередатчик RS-232 (3.3V / 5V)' },
      { label: 'Стандарт', value: 'TIA/EIA-232-F' },
      { label: 'Скорость передачи', value: 'до 250 кбит/с' },
      { label: 'Напряжение питания', value: '3.0…5.5 В' },
      { label: 'Количество драйверов/приёмников', value: '2 / 2' },
      { label: 'Внешние конденсаторы', value: '4× 0.1 мкФ' },
      { label: 'Корпус', value: 'SOIC-16 / DIP-16 / TSSOP-16' },
      { label: 'Тип монтажа', value: 'THT / SMD' },
      { label: 'Рабочая температура', value: '0…+70°C / -40…+85°C' },
    ],
  },
  {
    sku: 'W25Q32', category: 'Память',
    specs: [
      { label: 'Производитель', value: 'Winbond' },
      { label: 'Тип', value: 'Serial Flash (NOR)' },
      { label: 'Объём', value: '32 Мбит (4 МБ)' },
      { label: 'Интерфейс', value: 'SPI (до 104 МГц), Dual/Quad-SPI' },
      { label: 'Напряжение питания', value: '2.7…3.6 В' },
      { label: 'Корпус', value: 'SOIC-8 / WSON-8' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
  {
    sku: 'W25Q64', category: 'Память',
    specs: [
      { label: 'Производитель', value: 'Winbond' },
      { label: 'Тип', value: 'Serial Flash (NOR)' },
      { label: 'Объём', value: '64 Мбит (8 МБ)' },
      { label: 'Интерфейс', value: 'SPI, Dual/Quad-SPI (до 104 МГц)' },
      { label: 'Напряжение питания', value: '2.7…3.6 В' },
      { label: 'Корпус', value: 'SOIC-8 / WSON-8' },
      { label: 'Тип монтажа', value: 'SMD' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Дополнительные датчики
// ───────────────────────────────────────────────────────────────────────────────

const SENSORS_EXTRA: Entry[] = [
  {
    sku: 'ADXL372', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Analog Devices' },
      { label: 'Тип', value: '3-осный акселерометр (ultra-low power)' },
      { label: 'Диапазон измерения', value: '±200 g (высокие перегрузки)' },
      { label: 'Чувствительность', value: '4.9 мг/LSB (12-bit)' },
      { label: 'Частота выборки (ODR)', value: '400 Гц … 6400 Гц' },
      { label: 'Интерфейс', value: 'I2C / SPI (4-wire)' },
      { label: 'Напряжение питания', value: '1.6…3.6 В' },
      { label: 'Ток потребления (active)', value: '7 мкА (при 400 Гц)' },
      { label: 'Ток потребления (standby)', value: '<0.1 мкА' },
      { label: 'FIFO', value: '512 (12-bit) или 384 (8-bit) проб' },
      { label: 'Встроенные функции', value: 'Activity detection, single/double tap' },
      { label: 'Корпус', value: 'LGA-14 (3.0×3.4×0.95 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+125°C' },
    ],
  },
  {
    sku: 'TSL2561', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'AMS / TAOS (Texas Advanced Optoelectronic)' },
      { label: 'Тип', value: 'Цифровой датчик освещённости (видимый + ИК)' },
      { label: 'Диапазон измерения', value: '0.1…40000 люкс' },
      { label: 'Интерфейс', value: 'I2C (адреса 0x29, 0x39, 0x49)' },
      { label: 'Напряжение питания', value: '2.7…3.6 В' },
      { label: 'Ток потребления (active)', value: '0.6 мА' },
      { label: 'Ток потребления (power-down)', value: '15 мкА (макс.)' },
      { label: 'Интеграция', value: 'Programmable, 13.7 мс … 402 мс' },
      { label: 'Корпус', value: 'TMB-6 / FN-6' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-30…+70°C' },
    ],
  },
  {
    sku: 'APDS9960', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Broadcom / Avago' },
      { label: 'Тип', value: 'Датчик жестов, RGB, освещённости, приближения' },
      { label: 'Жесты', value: 'Up/Down/Left/Right/Clockwise/CCW (UV/IR/RGB)' },
      { label: 'Диапазон приближения', value: 'до 100 мм (программируемый)' },
      { label: 'Спектр RGB', value: 'R/G/B + Clear (4 фотодиода)' },
      { label: 'Интерфейс', value: 'I2C (адрес 0x39)' },
      { label: 'Напряжение питания', value: '2.4…3.6 В (VDD), 1.7…3.6 В (VLOGIC)' },
      { label: 'Ток потребления (active)', value: '~1 мкА…10 мА (зависит от LED)' },
      { label: 'ИК-LED', value: 'Встроенный (940 нм)' },
      { label: 'Корпус', value: 'LGA-8 (3.94×2.36×1.35 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-30…+85°C' },
    ],
  },
  {
    sku: 'OPT3001', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Texas Instruments' },
      { label: 'Тип', value: 'Цифровой датчик освещённости (точный)' },
      { label: 'Диапазон измерения', value: '0.01…83000 люкс (авто-диапазон)' },
      { label: 'Спектральная чувствительность', value: 'Под глаз человека (550 нм пик)' },
      { label: 'Интерфейс', value: 'I2C (адреса 0x44/0x45/0x46/0x47)' },
      { label: 'Разрядность', value: '21-bit (результат 4 байта)' },
      { label: 'Напряжение питания', value: '1.6…3.6 В' },
      { label: 'Ток потребления (active)', value: '1.8 мкА (тип.)' },
      { label: 'Корпус', value: 'USON-6 (1.7×1.5×0.6 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'LPS22HB', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'STMicroelectronics' },
      { label: 'Тип', value: 'Барометр (давление + температура)' },
      { label: 'Диапазон давления', value: '260…1260 гПа' },
      { label: 'Точность давления', value: '±0.1 гПа (отн.), ±0.025 гПа (стабильность)' },
      { label: 'Разрешение', value: '0.008 гПа (24-bit)' },
      { label: 'Частота выборки (ODR)', value: '1…75 Гц' },
      { label: 'Интерфейс', value: 'I2C / SPI (3-wire/4-wire)' },
      { label: 'Напряжение питания', value: '1.7…3.6 В' },
      { label: 'Ток потребления (active)', value: '~3 мкА (low-power)' },
      { label: 'Корпус', value: 'HLGA-10 (2.5×2.5×0.8 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
  {
    sku: 'BMI270', category: 'Датчики',
    specs: [
      { label: 'Производитель', value: 'Bosch Sensortec' },
      { label: 'Тип', value: '6-осный IMU (гироскоп + акселерометр)' },
      { label: 'Диапазон гироскопа', value: '±125/±250/±500/±1000/±2000 °/с' },
      { label: 'Диапазон акселерометра', value: '±2/±4/±8/±16 g' },
      { label: 'Частота выборки', value: 'до 6.4 кГц (гироскоп), 1.6 кГц (аксель)' },
      { label: 'Интерфейс', value: 'I2C / SPI (4-wire)' },
      { label: 'Напряжение питания', value: '1.7…3.6 В' },
      { label: 'Ток потребления (active)', value: '~650 мкА (гироскоп+аксель)' },
      { label: 'FIFO', value: '1024 байта' },
      { label: 'Корпус', value: 'LGA-14 (2.5×3.0×0.83 мм)' },
      { label: 'Тип монтажа', value: 'SMD' },
      { label: 'Рабочая температура', value: '-40…+85°C' },
    ],
  },
];

// ───────────────────────────────────────────────────────────────────────────────
// Сводная карта
// ───────────────────────────────────────────────────────────────────────────────

export const FULL_SPECS_DB: Entry[] = [
  ...OP_AMPS,
  ...REGULATORS,
  ...MCUS,
  ...TRANSISTORS,
  ...DIODES,
  ...LOGIC,
  ...OPTO,
  ...SENSORS,
  ...INTERFACES,
  ...MEMORY,
  ...ADC_DAC,
  ...CONNECTORS,
  // Расширенные секции
  ...DIODES_EXTRA,
  ...TRANSISTORS_EXTRA,
  ...OPTO_EXTRA,
  ...INTERFACES_MEMORY_EXTRA,
  ...SENSORS_EXTRA,
];

/**
 * Ищет точное совпадение по SKU (case-insensitive) в курируемой БД.
 * Возвращает массив параметров или null.
 */
export function lookupFullSpecs(sku: string): Spec[] | null {
  if (!sku) return null;
  const upper = sku.toUpperCase().trim();
  const entry = FULL_SPECS_DB.find(e => e.sku.toUpperCase() === upper);
  return entry ? entry.specs : null;
}

/**
 * Список всех SKU, поддерживаемых БД (для отладки и тестирования).
 */
export function listSupportedSkus(): string[] {
  return FULL_SPECS_DB.map(e => e.sku);
}
