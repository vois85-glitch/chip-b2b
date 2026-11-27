import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ComponentSearch from '@/components/sections/ComponentSearch';

import BreadcrumbNav from '@/components/ui/BreadcrumbNav';
const BASE_URL = 'https://www.chip-net.ru';

export const revalidate = 3600;

type Component = {
 sku: string;
 name: string;
 brand: string;
 category: string;
 description: string;
 status: string;
 analogs: string[];
};

type Props = {
 params: Promise<{ original: string }>;
};

// Common analog mappings for SEO
const analogMappings: Record<string, {
 title: string;
 description: string;
 h1: string;
 text: string;
 analogs: { original: string; replacement: string; manufacturer: string; compatibility: string }[];
 faq: { question: string; answer: string }[];
 related?: string[];
}> = {
 "stm32f103-gd32f103": {
 title: "Аналог STM32F103 — GD32F103 | Кросс-референс замена",
 description: "GD32F103 — полный аналог STM32F103 с совместимостью pin-to-pin и программной. Сравнение параметров, миграция проектов, проверка в СВП.",
 h1: "GD32F103 как аналог STM32F103",
 text: "GD32F103 от Gigadevice Semiconductor является полным аналогом STM32F103 от STMicroelectronics с совместимостью pin-to-pin, программной и периферийной. Микроконтроллер построен на ядре ARM Cortex-M3 с рабочей частотой до 108 МГц (STM32F103 — 72 МГц). Область применения: промышленная автоматика, системы управления двигателями, измерительные приборы. Для миграции проекта достаточно заменить заголовочные файлы и пересобрать прошивку. Компоненты GD32 доступны без санкционных ограничений.",
 analogs: [
 { original: "STM32F103C8T6", replacement: "GD32F103C8T6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103RBT6", replacement: "GD32F103RBT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103VET6", replacement: "GD32F103VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F103ZET6", replacement: "GD32F103ZET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 ],
 faq: [
 { question: "Полностью ли совместим GD32F103 со STM32F103?", answer: "Да, GD32F103 совместим pin-to-pin и программно с STM32F103. Периферийные регистры идентичны, прошивка может быть пересобрана без изменения кода." },
 { question: "В чём разница между STM32F103 и GD32F103?", answer: "Основное отличие — максимальная частота: GD32F103 работает до 108 МГц против 72 МГц у STM32F103. Остальные параметры аналогичны." },
 { question: "Нужна ли перекладка платы при замене?", answer: "Нет, замена не требует изменений в разводке платы — корпуса и расположение выводов идентичны." },
 ],
 },
 "stm32f407-gd32f407": {
 title: "Аналог STM32F407 — GD32F407 | Кросс-референс замена",
 description: "GD32F407 — полный аналог STM32F407. ARM Cortex-M4, совместимость pin-to-pin. Миграция проектов, проверка в СВП.",
 h1: "GD32F407 как аналог STM32F407",
 text: "GD32F407 от Gigadevice — полный аналог STM32F407 от STMicroelectronics на базе ARM Cortex-M4 с FPU и частотой до 168 МГц. Полная совместимость pin-to-pin и программная позволяет заменить STM32F407 без перекладки платы и переписывания прошивки. Компоненты GD32 доступны без санкционных ограничений и являются оптимальным решением для импортозамещения.",
 analogs: [
 { original: "STM32F407VGT6", replacement: "GD32F407VGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F407ZGT6", replacement: "GD32F407ZGT6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 { original: "STM32F407VET6", replacement: "GD32F407VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
 ],
 faq: [
 { question: "Совместим ли GD32F407 по периферии?", answer: "Да, все периферийные модули (UART, SPI, I2C, CAN, USB, Ethernet) идентичны по регистрам." },
 { question: "Поддерживает ли GD32F407 DSP инструкции?", answer: "Да, ядро ARM Cortex-M4 с FPU поддерживает DSP инструкции аналогично STM32F407." },
 ],
 },
 "spartan-6-gowin": {
 title: "Аналог Xilinx Spartan-6 — Gowin | Кросс-референс FPGA",
 description: "ПЛИС Gowin GW1N/GW2A как аналоги Xilinx Spartan-6. Миграция проектов, совместимость, проверка в СВП.",
 h1: "Gowin как аналог Xilinx Spartan-6",
 text: "ПЛИС Gowin Semiconductor серий GW1N и GW2A являются альтернативой Xilinx Spartan-6 для проектов, требующих доступных FPGA. Gowin предлагает инструменты миграции проектов (Gowin EDA), поддерживающие импорт VHDL/Verilog из Xilinx ISE/Vivado. Серии GW1N компактные (от 1K до 55K LUT), GW2A — среднего класса (от 20K до 200K LUT). Gowin доступен без санкционных ограничений.",
 analogs: [
 { original: "XC6SLX9", replacement: "GW1N-9", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 { original: "XC6SLX16", replacement: "GW1N-16", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 { original: "XC6SLX45", replacement: "GW2A-55", manufacturer: "Gowin", compatibility: "VHDL/Verilog миграция" },
 ],
 faq: [
 { question: "Насколько сложно мигрировать проект с Spartan-6 на Gowin?", answer: "Миграция зависит от сложности проекта. Синтезируемый HDL-код переносится легко. IP-ядра Xilinx требуют замены на аналогичные от Gowin." },
 ],
 },
  "STM32F103C8T6": {
    title: "Аналог STM32F103C8T6 — GD32F103C8T6 | Замена под санкции",
    description: "GD32F103C8T6 — полный аналог STM32F103C8T6: ARM Cortex-M3, 72 МГц, 64KB Flash, 20KB RAM. Pin-to-pin совместимость, доступен без санкционных ограничений.",
    h1: "Аналог STM32F103C8T6 — GD32F103C8T6",
    text: "STM32F103C8T6 от STMicroelectronics — один из самых популярных микроконтроллеров серии STM32, снят с поставок в РФ из-за санкций. Полным аналогом является GD32F103C8T6 от Gigadevice Semiconductor с идентичной архитектурой ARM Cortex-M3, частотой 72 МГц (разгон до 108 МГц), 64KB Flash и 20KB RAM. Корпус LQFP48, расположение выводов полностью совпадает. Периферия, регистры, библиотеки HAL/LL — совместимы. Миграция прошивки: заменить заголовочные файлы, пересобрать проект. Поставка с подтверждением подлинности в лаборатории СВП.",
    analogs: [
      { original: "STM32F103C8T6", replacement: "GD32F103C8T6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F103C8T6", replacement: "HK32F103C8T6", manufacturer: "HK Microchip", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F103C8T6", replacement: "CH32F103C8T6", manufacturer: "WCH", compatibility: "Pin-to-pin, программная" }
    ],
    faq: [
      { question: "Полностью ли совместим GD32F103C8T6 со STM32F103C8T6?", answer: "Да, GD32F103C8T6 полностью совместим pin-to-pin и программно. Периферийные регистры идентичны, прошивка может быть пересобрана без изменения исходного кода." },
      { question: "Можно ли использовать тот же код HAL?", answer: "Да, библиотеки HAL/LL от GD32 совместимы с STM32 HAL на уровне API. Достаточно заменить заголовочные файлы и обновить пути в проекте." },
      { question: "Какие частоты поддерживает GD32F103C8T6?", answer: "Базовая частота 72 МГц (как у STM32F103C8T6), но GD32 поддерживает разгон до 108 МГц без потери стабильности." }
    ]
  },
  "STM32F407VET6": {
    title: "Аналог STM32F407VET6 — GD32F407VET6 | Pin-to-pin замена",
    description: "GD32F407VET6 — полный аналог STM32F407VET6: ARM Cortex-M4, 168 МГц, 512KB Flash. Полная совместимость pin-to-pin и программная.",
    h1: "Аналог STM32F407VET6 — GD32F407VET6",
    text: "STM32F407VET6 от STMicroelectronics — высокопроизводительный микроконтроллер ARM Cortex-M4 с FPU, 168 МГц, 512KB Flash, 192KB RAM. Полным аналогом является GD32F407VET6 от Gigadevice с идентичными характеристиками и полной совместимостью pin-to-pin, программной и периферийной. Корпус LQFP100. Поддержка DSP инструкций, USB OTG, Ethernet, CAN. Идеален для замены в существующих проектах без перекладки платы.",
    analogs: [
      { original: "STM32F407VET6", replacement: "GD32F407VET6", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, программная" },
      { original: "STM32F407VET6", replacement: "HK32F407VET6", manufacturer: "HK Microchip", compatibility: "Pin-to-pin, программная" }
    ],
    faq: [
      { question: "Совместим ли GD32F407VET6 по периферии?", answer: "Да, все периферийные модули (UART, SPI, I2C, CAN, USB OTG, Ethernet) идентичны по регистрам." },
      { question: "Поддерживает ли GD32F407 DSP инструкции?", answer: "Да, ядро ARM Cortex-M4 с FPU поддерживает DSP инструкции аналогично STM32F407." }
    ]
  },
  "ESP32-WROOM-32": {
    title: "Аналог ESP32-WROOM-32 — замены от китайских производителей",
    description: "Аналоги ESP32-WROOM-32: ESP32-C3, ESP32-S2, BK7231. Сравнение параметров, совместимость, доступность без санкций.",
    h1: "Аналоги ESP32-WROOM-32",
    text: "ESP32-WROOM-32 от Espressif Systems — популярный Wi-Fi/BLE модулем на базе ESP32 (Xtensa LX6, 240 МГц, 520KB SRAM). Хотя сам ESP32 доступен без санкционных ограничений (Espressif — китайская компания), для проектов, требующих альтернативных поставщиков или специфических характеристик, существуют аналоги. ESP32-C3 — RISC-V ядро, более дешёвый. ESP32-S2 — без Bluetooth, с USB OTG. BK7231 от Beken (через Huntak) — для простых Wi-Fi приложений.",
    analogs: [
      { original: "ESP32-WROOM-32", replacement: "ESP32-C3-WROOM-02", manufacturer: "Espressif", compatibility: "Совместимая библиотека, RISC-V" },
      { original: "ESP32-WROOM-32", replacement: "ESP32-S2-WROOM", manufacturer: "Espressif", compatibility: "Wi-Fi только, без BLE" },
      { original: "ESP32-WROOM-32", replacement: "BK7231N", manufacturer: "Beken", compatibility: "Частичная, другой SDK" }
    ],
    faq: [
      { question: "Доступен ли ESP32-WROOM-32 в России?", answer: "Да, Espressif Systems не подпадает под санкции, ESP32-WROOM-32 доступен для поставки напрямую из Китая через параллельный импорт." },
      { question: "Какой аналог дешевле?", answer: "ESP32-C3 (RISC-V) дешевле на 30-40% при сохранении большинства функций. Подходит для новых проектов." }
    ]
  },
  "ATmega328P": {
    title: "Аналог ATmega328P — замены AVR микроконтроллера",
    description: "Аналоги ATmega328P: LGT8F328P, ATmega328PB. Pin-to-pin совместимость, миграция кода Arduino, доступность.",
    h1: "Аналоги ATmega328P",
    text: "ATmega328P от Microchip (бывш. Atmel) — 8-битный AVR микроконтроллер, основа Arduino Uno. Полным аналогом является ATmega328PB (расширенная версия с дополнительной периферией) и LGT8F328P от LogicGreen (дешевле, почти полностью совместим). Для импортозамещения также подходит STM8S103 от STMicroelectronics, но требует переписывания кода. Корпус DIP-28 или TQFP-32, тактовая частота 20 МГц, 32KB Flash, 2KB SRAM, 1KB EEPROM.",
    analogs: [
      { original: "ATmega328P", replacement: "ATmega328PB", manufacturer: "Microchip", compatibility: "Pin-to-pin, программная, расшир. периферия" },
      { original: "ATmega328P", replacement: "LGT8F328P", manufacturer: "LogicGreen", compatibility: "Pin-to-pin, программная, Arduino-совместим" },
      { original: "ATmega328P", replacement: "STM8S103F3", manufacturer: "STMicroelectronics", compatibility: "Требует переноса кода (другая архитектура)" }
    ],
    faq: [
      { question: "Совместим ли LGT8F328P с Arduino IDE?", answer: "Да, LGT8F328P поддерживается Arduino IDE через пакет Larduino. Большинство скетчей работают без изменений." },
      { question: "Поддерживает ли ATmega328PB старый код?", answer: "Да, ATmega328PB полностью совместим с ATmega328P на уровне кода, но имеет дополнительные периферийные модули (UART1, SPI1, I2C1)." }
    ]
  },
  "TPS5430": {
    title: "Аналог TPS5430 — импульсный DC-DC понижающий преобразователь",
    description: "Аналоги TPS5430: TPS54331, LM2675, MP9486. Pin-to-pin совместимость, замена под санкции.",
    h1: "Аналоги TPS5430 (TI) — понижающий DC-DC 3A",
    text: "TPS5430 от Texas Instruments — импульсный понижающий DC-DC преобразователь на 3A, входное напряжение до 36V, частота 500 кГц. Используется в промышленной электронике. Аналоги: TPS54331 (та же серия, расширенный диапазон), LM2675 (от TI, 1A — нужен пересмотр схемы), MP9486 от Monolithic Power (полный аналог, доступен без санкций). Корпус SO PowerPAD-8. Pin-to-pin совместимость сохраняется между TPS5430 и TPS54331.",
    analogs: [
      { original: "TPS5430", replacement: "TPS54331", manufacturer: "Texas Instruments", compatibility: "Pin-to-pin, расширенный диапазон" },
      { original: "TPS5430", replacement: "MP9486", manufacturer: "Monolithic Power", compatibility: "Pin-to-pin, программная" },
      { original: "TPS5430", replacement: "LM2675", manufacturer: "Texas Instruments", compatibility: "Требует пересмотра схемы (1A)" }
    ],
    faq: [
      { question: "Доступен ли TPS5430 в России?", answer: "Texas Instruments приостановила прямые поставки в РФ, но TPS5430 доступен через параллельный импорт или заменяется на MP9486 от MPS (китайский производитель)." },
      { question: "Можно ли заменить TPS5430 на TPS54331 без изменения платы?", answer: "Да, TPS54331 pin-to-pin совместим с TPS5430 и имеет расширенный диапазон входного напряжения (до 28V vs 36V у TPS5430)." }
    ]
  },
  "LM2596": {
    title: "Аналог LM2596 — понижающий DC-DC 3A, замены",
    description: "Аналоги LM2596: LM2596S, MP1584, XL4015. Сравнение параметров, доступность, замена.",
    h1: "Аналоги LM2596 (TI) — понижающий DC-DC 3A",
    text: "LM2596 от Texas Instruments (бывш. National Semiconductor) — классический импульсный понижающий преобразователь 3A, вход до 40V, частота 150 кГц. Один из самых массовых DC-DC. Аналоги: LM2596S (SMD версия), MP1584 от Monolithic Power (компактнее, 3A), XL4015 от XLSEMI (китайский клон, 5A). Корпуса D2PAK-5 / TO-263-5. Большинство аналогов pin-to-pin совместимы, но требуют проверки номиналов внешних компонентов.",
    analogs: [
      { original: "LM2596", replacement: "LM2596S", manufacturer: "Texas Instruments", compatibility: "Pin-to-pin, SMD версия" },
      { original: "LM2596", replacement: "MP1584", manufacturer: "Monolithic Power", compatibility: "Pin-to-pin (нужен пересмотр номиналов)" },
      { original: "LM2596", replacement: "XL4015", manufacturer: "XLSEMI", compatibility: "Pin-to-pin, 5A версия" }
    ],
    faq: [
      { question: "Доступен ли LM2596 в России?", answer: "LM2596 от TI доступен через параллельный импорт, но быстрее и дешевле использовать китайский аналог XL4015 (5A) или MP1584 (3A) от Monolithic Power." },
      { question: "Можно ли заменить LM2596 на XL4015?", answer: "Да, XL4015 — полный аналог LM2596 с тем же корпусом TO-263-5 и поддержкой тока до 5A. Внешние компоненты (дроссель, диод, конденсаторы) обычно остаются теми же." }
    ]
  },
  "AMS1117": {
    title: "Аналог AMS1117 — линейный LDO 1A, замены",
    description: "Аналоги AMS1117: RT9013, ME6211, AP2112. Pin-to-pin совместимость, замена на доступные.",
    h1: "Аналоги AMS1117 — LDO 1A",
    text: "AMS1117 от Advanced Monolithic Systems (производится в Китае) — линейный LDO стабилизатор 1A, падение 1.3V, корпуса SOT-223. Самый массовый LDO в Arduino/Raspberry Pi платах. Аналоги: RT9013 от Richtek (лучше параметры), ME6211 от Microne (низкое падение), AP2112 от BCD (аналог от производителя). Все pin-to-pin совместимы в корпусе SOT-223. Доступны без санкционных ограничений.",
    analogs: [
      { original: "AMS1117", replacement: "RT9013", manufacturer: "Richtek", compatibility: "Pin-to-pin SOT-223, лучшее падение" },
      { original: "AMS1117", replacement: "ME6211", manufacturer: "Microne", compatibility: "Pin-to-pin SOT-223, низкое падение 250mV" },
      { original: "AMS1117", replacement: "AP2112", manufacturer: "BCD Semiconductor", compatibility: "Pin-to-pin SOT-223, прямой аналог" }
    ],
    faq: [
      { question: "Доступен ли AMS1117 в России?", answer: "Да, AMS1117 — китайский компонент, доступен без санкционных ограничений. Производится в больших объёмах, поставки стабильны." },
      { question: "Какой аналог лучше?", answer: "ME6211 имеет самое низкое падение напряжения (250mV vs 1.3V у AMS1117), что важно для батарейных устройств. RT9013 — золотая середина по параметрам и цене." }
    ]
  },

  "NE5532P": {
    title: "NE5532P — аналоги и замена: чем заменить операционный усилитель",
    description: "Аналоги NE5532P: OPA2604, AD823, NJM2068, LM4562. Сравнение параметров, совместимость, замена pin-to-pin для аудио и измерений.",
    h1: "Чем заменить NE5532P",
    text: "NE5532P — сдвоенный малошумящий операционный усилитель от Texas Instruments/ON Semiconductor, стандарт для Hi-Fi аудио. После санкций доступен через параллельный импорт. Рассмотрим аналоги для замены.",
    analogs: [
      { original: "NE5532P", replacement: "OPA2604", manufacturer: "Texas Instruments", compatibility: "Pin-to-pin DIP-8/SOIC-8, аудио-класс, FET-вход" },
      { original: "NE5532P", replacement: "AD823", manufacturer: "Analog Devices", compatibility: "Pin-to-pin, низкий шум 16nV, полоса 16МГц" },
      { original: "NE5532P", replacement: "NJM2068", manufacturer: "NJR", compatibility: "Pin-to-pin DIP-8, аудио, низкая цена" },
      { original: "NE5532P", replacement: "LM4562", manufacturer: "Texas Instruments", compatibility: "Pin-to-pin, ультранизкий шум 2.7nV, Hi-End аудио" },
      { original: "NE5532P", replacement: "TL072", manufacturer: "TI/ST", compatibility: "Pin-to-pin, JFET-вход, дешевле, но выше шум 18nV" }
    ],
    faq: [
      { question: "Чем заменить NE5532P?", answer: "OPA2604 (TI, аудио-класс), AD823 (ADI), NJM2068 (NJR). Для Hi-End — LM4562 (2.7nV шум). Для бюджета — TL072 (18nV)." },
      { question: "Совместим ли OPA2604 с NE5532P?", answer: "Да, pin-to-pin совместим (DIP-8/SOIC-8). OPA2604 имеет FET-вход, выше входной импеданс, но чуть выше шум." },
      { question: "Можно ли купить NE5532P в России?", answer: "Да, через параллельный импорт. Производители: TI, ON, NJR. Проверка оригинальности в СВП." },
      { question: "Какой аналог для аудио?", answer: "LM4562 (TI) — ультранизкий шум 2.7nV, лучший для Hi-End. OPA2604 — FET-вход для высокоимпедансных источников." }
    ]
  },

  "IRFZ44N": {
    title: "IRFZ44N — аналоги и замена: чем заменить MOSFET транзистор",
    description: "Аналоги IRFZ44N: IRLZ44N, IRF3205, STP55NF06, AOT460. Сравнение параметров, Rds(on), напряжение, ток, совместимость.",
    h1: "Чем заменить IRFZ44N",
    text: "IRFZ44N — N-channel MOSFET от Infineon/Vishay, 55В 49А, Rds(on) 17.5мОм. Один из самых популярных силовых транзисторов. Рассмотрим аналоги для замены.",
    analogs: [
      { original: "IRFZ44N", replacement: "IRLZ44N", manufacturer: "Infineon", compatibility: "Pin-to-pin TO-220, logic-level (Vgs=5V), тот же корпус" },
      { original: "IRFZ44N", replacement: "IRF3205", manufacturer: "Infineon", compatibility: "Pin-to-pin TO-220, 55В 110А, Rds=8мОм (мощнее)" },
      { original: "IRFZ44N", replacement: "STP55NF06", manufacturer: "STMicroelectronics", compatibility: "Pin-to-pin TO-220, 60В 50А, Rds=14мОм" },
      { original: "IRFZ44N", replacement: "AOT460", manufacturer: "Alpha & Omega", compatibility: "Pin-to-pin TO-220, 60В 50А, Rds=12мОм" },
      { original: "IRFZ44N", replacement: "FQP55N06", manufacturer: "onsemi", compatibility: "Pin-to-pin TO-220, 60В 55А, Rds=16мОм" }
    ],
    faq: [
      { question: "Чем заменить IRFZ44N?", answer: "IRLZ44N (logic-level, Vgs=5V), IRF3205 (мощнее 110А), STP55NF06 (ST). Все pin-to-pin совместимы (TO-220)." },
      { question: "Можно ли заменить IRFZ44N на IRF3205?", answer: "Да, IRF3205 мощнее (110А vs 49А, Rds=8мОм vs 17.5мОм). Pin-to-pin совместим. Подходит для больших токов." },
      { question: "IRLZ44N vs IRFZ44N — в чём разница?", answer: "IRLZ44N — logic-level (открывается при 5V на затворе). IRFZ44N — нужен 10V. Для Arduino/MCU — IRLZ44N, для 12V — IRFZ44N." },
      { question: "Можно ли купить IRFZ44N в России?", answer: "Да, через параллельный импорт. Infineon, Vishay, ST. Также аналоги от onsemi, AOS. Проверка в СВП." }
    ]
  },

  "APM32": {
    title: "APM32 — аналог STM32: сравнение, совместимость, замена",
    description: "APM32 от Geehy (Китай) — аналог STM32 с pin-to-pin и программной совместимостью. Сравнение параметров, миграция проектов.",
    h1: "APM32 как аналог STM32",
    text: "APM32 от Geehy Semiconductor — китайский аналог STM32 с полной pin-to-pin и программной совместимостью. Семейство APM32F103 разработано как прямой аналог STM32F103: идентичный корпус LQFP48/LQFP64, расположение выводов, периферийные регистры и архитектура ARM Cortex-M3. Рабочая частота 96 МГц (против 72 МГц у STM32F103), 64-512 KB Flash, до 64 KB RAM. Библиотеки HAL/LL совместимы на 98% — для миграции достаточно заменить заголовочные файлы и пересобрать проект.\n\nСемейство APM32 доступно без санкционных ограничений и поставляется с подтверждением подлинности в лаборатории СВП. По цене APM32 находится на уровне GD32 (Gigadevice) и дешевле оригинального STM32 на 30-40%. Основные отличия от STM32: повышенная до 96 МГц частота, оптимизированный DMA, расширенные возможности USB. Незначительные отличия в реализации USB FS и DMA BD не критичны для большинства проектов.\n\nПрименение: промышленная автоматика, системы управления двигателями, измерительные приборы, IoT-устройства, бытовая электроника. APM32F103C8T6 — прямой аналог STM32F103C8T6 (самый популярный MCU в России). APM32F407 — аналог STM32F407 (Cortex-M4, 168 МГц, FPU).",
    analogs: [
      { original: "STM32F103", replacement: "APM32F103", manufacturer: "Geehy", compatibility: "Pin-to-pin, 98%, 96МГц" },
      { original: "STM32F103", replacement: "GD32F103", manufacturer: "Gigadevice", compatibility: "Pin-to-pin, 95%, 108МГц" },
      { original: "STM32F103", replacement: "HK32F103", manufacturer: "HKC", compatibility: "Pin-to-pin, 98%, военная приёмка" },
      { original: "STM32F103", replacement: "CH32F103", manufacturer: "WCH", compatibility: "Pin-to-pin, 80%, от 30руб" }
    ],
    faq: [
      { question: "APM32 аналог STM32?", answer: "Да, APM32F103 от Geehy — полный аналог STM32F103. Pin-to-pin, 98% программная." },
      { question: "Можно ли купить APM32?", answer: "Да, APM32 (Geehy, Китай) без санкций. Цена как GD32. СВП." },
      { question: "Совместим с библиотеками STM32?", answer: "Да, 98%. HAL/LL работают. Отличия в USB и DMA." },
      { question: "В чём отличие APM32 от GD32?", answer: "APM32 (Geehy) — 96 МГц, 98% совместимость. GD32 (Gigadevice) — 108 МГц, 95% совместимость. Оба pin-to-pin аналоги STM32F103. APM32 стабильнее в USB, GD32 быстрее." },
      { question: "Как мигрировать проект со STM32F103 на APM32F103?", answer: "Заменить заголовочные файлы stm32f1xx.h на apm32f1xx.h, обновить пути в линкере, пересобрать проект. Код HAL/LL переносится без изменений на 98%. USB и DMA требуют тестирования." }
    ],
    related: ['STM32F103C8T6', 'STM32F407VET6', 'NE5532P', 'IRFZ44N', 'AMS1117']
  },

  "LM358": {
    title: "LM358 — аналоги и замена: чем заменить операционный усилитель",
    description: "Аналоги LM358: TL072, NE5532, AD8512, OPA2134. Сравнение, совместимость, замена.",
    h1: "Чем заменить LM358",
    text: "LM358 — самый популярный сдвоенный операционный усилитель низкой частоты. Производится Texas Instruments, STMicroelectronics, ON Semiconductor, а также китайскими фабриками (Hangzhou Silan, Cosmos, UTC). Диапазон питания 3-32 В (однополярный) или ±1.5-16 В (двуполярный), ток потребления 0.5 мА на усилитель, входной ток смещения 20 нА. Корпус DIP-8 или SOIC-8.\n\nАналоги LM358 делятся на две группы: 1) прямые клоны (TL072, NE5532, AD8512, LMV358) с pin-to-pin совместимостью и улучшенными параметрами; 2) специализированные ОУ (OPA2134 для аудио, MCP602 для low-voltage, AD822 для rail-to-rail). TL072 — JFET-вариант с низким входным током (65 пА) и высокой скоростью нарастания 13 В/мкс. NE5532 — аудио-ОУ с малым шумом 5 нВ/√Гц. LMV358 — версия для низковольтных схем (от 2.7 В) с rail-to-rail выходом.\n\nПрименение: усилители сигналов датчиков, активные фильтры, компараторы, генераторы, интеграторы. LM358 подходит для большинства не прецизионных применений — точность 3 мВ смещения и полоса 1 МГц достаточны для 90% задач. Для аудиотракта выбирайте NE5532, для измерительных схем — AD8512, для батарейного питания — LMV358.",
    analogs: [
      { original: "LM358", replacement: "TL072", manufacturer: "TI/ST", compatibility: "Pin-to-pin, JFET, 13В/мкс" },
      { original: "LM358", replacement: "NE5532", manufacturer: "TI/ON", compatibility: "Pin-to-pin, 5нВ, аудио" },
      { original: "LM358", replacement: "AD8512", manufacturer: "ADI", compatibility: "Pin-to-pin, JFET" },
      { original: "LM358", replacement: "LMV358", manufacturer: "TI", compatibility: "Pin-to-pin, 2.7V, rail-to-rail" }
    ],
    faq: [
      { question: "Чем заменить LM358?", answer: "TL072 (JFET), NE5532 (аудио). Для low-V — LMV358." },
      { question: "LM358 на TL072?", answer: "Да, pin-to-pin. Но TL072 от 7В, LM358 от 3В." },
      { question: "Купить LM358?", answer: "Да, от 5руб. TI, ST, ON. СВП." },
      { question: "LM358 или NE5532 для аудио?", answer: "NE5532 — лучше. Шум 5 нВ/√Гц (LM358 — 40 нВ/√Гц), скорость нарастания 9 В/мкс (LM358 — 0.3 В/мкс). LM358 годится только для предварительных каскадов." },
      { question: "Какой корпус у LM358?", answer: "DIP-8 (THT, 7.62 мм шаг), SOIC-8 (SMD, 1.27 мм шаг), TSSOP-8 (SMD, 0.65 мм). Также MSOP-8 для миниатюрных плат." }
    ],
    related: ['NE5532P', 'APM32', 'UC3842', 'AMS1117']
  },

  "UC3842": {
    title: "UC3842 — аналоги и замена: чем заменить ШИМ-контроллер",
    description: "Аналоги UC3842: UC3843, NCP1200, L6565. Замена для импульсных БП.",
    h1: "Чем заменить UC3842",
    text: "UC3842 — ШИМ-контроллер для импульсных источников питания, разработанный Unitrode (ныне Texas Instruments). Производится TI, ON Semiconductor, STMicroelectronics, а также китайскими аналогами (CS3842, SG3842, KA3842). Архитектура: токовый режим управления (current-mode), рабочий цикл до 50%, частота генерации до 500 кГц. Порог стартового напряжения UVLO 16 В (отключение при 10 В), ток потребления в работе 12 мА, в старте 1 мА.\n\nПрямой аналог UC3843 отличается только порогом UVLO: 8.5 В старт / 7.6 В отключение (против 16/10 В у UC3842). Это позволяет использовать UC3843 в низковольтных приложениях (например, в системах с 12 В питанием без повышения напряжения). NCP1200 от onsemi — улучшенная версия со встроенным MOSFET-драйвером и режимом квазирезонансного переключения для снижения EMI. L6565 от ST — специализированный контроллер для PFC (power factor correction) в схемах коррекции коэффициента мощности.\n\nПрименение: обратноходовые преобразователи (flyback) до 200 Вт, прямоходовые конвертеры, зарядные устройства, AC/DC блоки питания, LED-драйверы. UC3842 — стандарт de-facto для недорогих импульсных БП, имеет сотни миллионов выпущенных устройств. Для новых проектов рекомендуется UC3843 (более гибкий UVLO) или NCP1200 (меньше компонентов обвязки).",
    analogs: [
      { original: "UC3842", replacement: "UC3843", manufacturer: "TI/ON", compatibility: "Pin-to-pin, старт 8.5V" },
      { original: "UC3842", replacement: "NCP1200", manufacturer: "onsemi", compatibility: "Pin-to-pin, MOSFET-драйвер" },
      { original: "UC3842", replacement: "L6565", manufacturer: "ST", compatibility: "Pin-to-pin, PFC" }
    ],
    faq: [
      { question: "Чем заменить UC3842?", answer: "UC3843 (старт 8.5V), NCP1200 (драйвер), L6565 (PFC)." },
      { question: "UC3842 vs UC3843?", answer: "UC3842: старт 16V. UC3843: старт 8.5V." },
      { question: "Купить UC3842?", answer: "Да, TI, ON, ST. От 1 шт, СВП." },
      { question: "На какой частоте работает UC3842?", answer: "Частота генерации настраивается RC-цепью на выводе Rt/Ct, диапазон 100 Гц — 500 кГц. Типовые значения: 50-200 кГц для flyback, 100-250 кГц для forward. Для снижения EMI рекомендуется квазирезонансный режим." },
      { question: "Можно ли заменить UC3842 на KA3842?", answer: "Да, KA3842 (Samsung/FAIRCHILD) — полный аналог UC3842. То же pin-to-pin, те же параметры UVLO 16V/10V. Также аналогичны SG3842, CS3842, AP3842." }
    ],
    related: ['LM2596', 'TPS5430', 'AMS1117', 'PC817']
  },

  "PC817": {
    title: "PC817 — аналоги и замена: чем заменить оптопару",
    description: "Аналоги PC817: TLP785, SFH617A, EL817. CTR, изоляция, совместимость.",
    h1: "Чем заменить PC817",
    text: "PC817 — самый популярный оптрон (оптопара) с фототранзисторным выходом. Производится Sharp (оригинал), а также Vishay (SFH617A), Toshiba (TLP785), Everlight (EL817), LiteOn (LTV-817), Kingbright, Cosmo. Корпус DIP-4 (4 вывода), изоляция вход-выход 5000 В RMS, напряжение пробоя 35 В, время нарастки 4 мкс, спада 3 мкс. Вход — инфракрасный светодиод (IRED) с прямым током 50 мА, прямым напряжением 1.2 В.\n\nКоэффициент передачи тока (CTR — Current Transfer Ratio) для PC817 составляет 50-600% в зависимости от класса: PC817A (50-80%), PC817B (80-160%), PC817C (130-260%), PC817D (200-400%), PC817AB (50-150%), PC817CD (200-600%). При входном токе 5 мА выходной ток составляет 2.5-30 мА. CTR деградирует со временем — при 25°C и токе 5 мА срок службы >100 000 часов, при 50°C и 20 мА снижается до 50 000 часов.\n\nПрименение: гальваническая развязка в импульсных БП (обратная связь по напряжению), изоляция интерфейсов (I2C, SPI, UART между доменами питания), управление симисторами через драйвер MOC3061, развязка логических сигналов в промышленной автоматике. PC817 — самый дешевый оптрон (от 8 руб/шт), но для высокоскоростных сигналов (>100 кбит/с) выбирайте 6N139 (высокоскоростной с базовым выводом), для управления мощной нагрузкой — MOC3061 (с детектором нуля).",
    analogs: [
      { original: "PC817", replacement: "TLP785", manufacturer: "Toshiba", compatibility: "Pin-to-pin DIP-4, 5000В" },
      { original: "PC817", replacement: "SFH617A", manufacturer: "Vishay", compatibility: "Pin-to-pin DIP-4, 5300В" },
      { original: "PC817", replacement: "EL817", manufacturer: "Everlight", compatibility: "Pin-to-pin DIP-4, 5000В" }
    ],
    faq: [
      { question: "Чем заменить PC817?", answer: "TLP785 (Toshiba), SFH617A (Vishay), EL817 (Everlight)." },
      { question: "Что такое CTR?", answer: "CTR — 50-600%. Вход 5мА → выход 2.5-30мА." },
      { question: "Купить PC817?", answer: "Да, от 8руб. Sharp, Everlight. СВП." },
      { question: "Какой CTR у PC817C?", answer: "PC817C: CTR 130-260% при входном токе 5 мА. Класс C — средний диапазон, подходит для большинства применений. Для повышенной чувствительности выбирайте PC817D (200-400%)." },
      { question: "Как проверить PC817 мультиметром?", answer: "Подайте 5 В через резистор 1 кОм на вход (пины 1-2, анод-катод). На выходе (пины 3-4, эмиттер-коллектор) должен быть ток 2-15 мА. CTR = (Iвых / Iвх) × 100%. Если выходной ток отсутствует — оптран неисправен." }
    ],
    related: ['NE5532P', 'APM32', 'LM358', 'UC3842']
  }

};

// Brand URL mapping — only brands with existing pages
const BRAND_HREFS: Record<string, string> = {
  'TI': '/texas-instruments',
  'TI/ST': '/texas-instruments',
  'TI/ON': '/texas-instruments',
  'ST': '/stmicroelectronics',
  'onsemi': '/onsemi',
  'ADI': '/analog-devices',
  'Vishay': '/vishay',
  'Toshiba': '/toshiba',
  'Gigadevice': '/gigadevice',
};

function brandHref(mfr: string): string | null {
  return BRAND_HREFS[mfr] || null;
}

export async function generateStaticParams() {
 return Object.keys(analogMappings).map((original) => ({ original }));
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { original } = await params;
 const mapping = analogMappings[original];

 if (!mapping) {
 return { title: 'Кросс-референс не найден' };
 }

 const url = `${BASE_URL}/analog/${original}`;

 return {
 title: mapping.title,
 description: mapping.description,
 alternates: { canonical: url },
 openGraph: {
 title: mapping.title,
 description: mapping.description,
 url,
 type: 'article',
 locale: 'ru_RU',
 siteName: 'ChipNet',
 },
 };
}

export default async function AnalogPage({ params }: Props) {
 const { original } = await params;
 const mapping = analogMappings[original];

 if (!mapping) {
 notFound();
 }

 const url = `${BASE_URL}/analog/${original}`;

 const articleLd = {
 '@context': 'https://schema.org',
 '@type': 'Article',
 headline: mapping.h1,
 description: mapping.description,
 url,
 author: { '@type': 'Organization', name: 'ChipNet', url: BASE_URL },
 publisher: { '@type': 'Organization', name: 'ChipNet', url: BASE_URL },
 };

 const faqLd = mapping.faq ? {
 '@context': 'https://schema.org',
 '@type': 'FAQPage',
 mainEntity: mapping.faq.map(f => ({
 '@type': 'Question',
 name: f.question,
 acceptedAnswer: { '@type': 'Answer', text: f.answer },
 })),
 } : null;

 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
 {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
 <main className="min-h-screen bg-background text-[#121212]">
 <div className="max-w-4xl mx-auto px-4 pt-[180px] pb-16">
 <BreadcrumbNav
        className="mb-4"
        items=[{"        { name: 'Главная', href: '/' },\n        { name: 'Аналоги', href: '/analogs' },\n        { name: '{original}' }"}]
      />

 <h1 className="text-3xl md:text-4xl font-bold mb-6 text-primary">{mapping.h1}</h1>

 <div className="mb-8 leading-relaxed text-[#666] text-lg">
 {mapping.text.split('\n\n').map((para, i) => (
 <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
 ))}
 </div>

 {mapping.analogs.length > 0 && (
 <div className="overflow-x-auto rounded-xl border border-[#e8e8e8] mb-8">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-[#eaf0e8] border-b border-[#e8e8e8]">
 <th className="text-left py-4 px-4 text-[#666] font-medium">Оригинал</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Аналог</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Производитель</th>
 <th className="text-left py-4 px-4 text-[#666] font-medium">Совместимость</th>
 </tr>
 </thead>
 <tbody>
 {mapping.analogs.map((a, i) => {
 const originalHref = analogMappings[a.original] ? `/analog/${a.original}` : null;
 const replacementHref = analogMappings[a.replacement] ? `/analog/${a.replacement}` : null;
 const bHref = brandHref(a.manufacturer);
 return (
 <tr key={i} className="border-b border-[#e8e8e8] hover:bg-[#eaf0e8] transition-colors">
 <td className="py-3 px-4 font-mono font-medium text-primary">
 {originalHref ? (
 <Link prefetch={false} href={originalHref} className="hover:underline">{a.original}</Link>
 ) : a.original}
 </td>
 <td className="py-3 px-4 font-mono font-medium">
 {replacementHref ? (
 <Link prefetch={false} href={replacementHref} className="hover:underline text-primary">{a.replacement}</Link>
 ) : a.replacement}
 </td>
 <td className="py-3 px-4 text-[#666]">
 {bHref ? (
 <Link prefetch={false} href={bHref} className="hover:underline">{a.manufacturer}</Link>
 ) : a.manufacturer}
 </td>
 <td className="py-3 px-4 text-[#757575] text-xs">{a.compatibility}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}

 {mapping.related && mapping.related.length > 0 && (
 <section className="mt-12">
 <h2 className="text-2xl font-bold mb-6 text-[#121212]">Смотрите также</h2>
 <div className="flex flex-wrap gap-3">
 {mapping.related
 .filter((rel) => analogMappings[rel] && rel !== original)
 .map((rel) => (
 <Link
 key={rel}
 href={`/analog/${rel}`}
 className="inline-flex items-center px-4 py-2 rounded-full border border-[#e8e8e8] bg-white hover:bg-[#eaf0e8] hover:border-primary text-sm font-mono text-[#121212] transition-colors"
 >
 {rel}
 </Link>
 ))}
 </div>
 </section>
 )}

 {mapping.faq && mapping.faq.length > 0 && (
 <section className="mt-12">
 <h2 className="text-2xl font-bold mb-6 text-[#121212]">Часто задаваемые вопросы</h2>
 <div className="space-y-4">
 {mapping.faq.map((item, i) => (
 <details key={i} className="group bg-[#f0f4ee] rounded-2xl border border-[#e8e8e8] overflow-hidden">
 <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#eaf0e8] transition-colors">
 <span className="font-semibold text-[#121212] pr-4">{item.question}</span>
 <svg className="w-5 h-5 text-[#757575] group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
 </svg>
 </summary>
 <div className="px-5 pb-5 text-[#666] leading-relaxed">{item.answer}</div>
 </details>
 ))}
 </div>
 </section>
 )}
 </div>
 </main>
 </>
 );
}
