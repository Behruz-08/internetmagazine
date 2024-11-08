// import { IDelivery, IHistoryOfOrder, IOrder, IPayment, IProduct, IRegistration } from './../../client/src/types/Model';
import { IDelivery, IHistoryOfOrder, IOrder, IPayment, IProduct, IRegistration } from './../../frontend/src/types/Model';
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3009;
import { v4 as uuidv4 } from 'uuid';
import moment = require('moment');
import productRoutes from './routes/ProductRoute';
import userRouter from './routes/UserRoutes';
import { Request, Response } from 'express';
const db = require('./db')


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());


// история покупок
const orders: IOrder[] = [];
const deliveryInfo: IDelivery[] = []
const payments: IPayment[] = [];
const productsFromCart: IProduct[] = []

const HistoryOfOrders: IHistoryOfOrder[] = [];

// массив продуктов 
// const products: IProduct[] = [{
//   id: uuidv4(),
//   name: "Куртка ДЕЛЬТА ПЛЮС",
//   img: "/products/overalls/1.jpg",
//   price: 2958,
//   inStock: true,
//   detailed: "Куртка прямого силуэта, с центральной застежкой-молнией, закрытой ветрозащитным планкой, с отложным воротником, с большим   количеством накладных и прорезных карманов.  Рукава с локтевым швом на манжетах, застегивающихся с помощью кнопки. В области подмышечных впадин – вентиляционные отверстия с люверсами. Материал: смесовая ткань(65% полиэстер, 35 % хлопок), плотность 245 г / кв.м",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Каска строительная GTM усиленная Оранжевая (DT-D028)",
//   img: "/products/overalls/2.jpg",
//   price: 860,
//   inStock: true,
//   detailed: "Тип СИЗ: Каска строительная Цвет: Оранжевый Материал: ABS - пластик Размер: 53 - 64 см Амортизация: есть Точки фиксации: 6 Рабочая температура, С: -40...+ 50 Регулировка: есть Вентиляция: есть Вес, г: 420 Стандарт защиты: EN 397",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм СОЮЗСПЕЦОДЕЖДА Дон ЭКОНОМ синий",
//   img: "/products/overalls/3.jpg",
//   price: 3490,
//   inStock: true,
//   detailed: "Костюм СОЮЗСПЕЦОДЕЖДА Дон ЭКОНОМ синий, р. 44-46, рост 182-188 2000000047997 состоит из брюк и куртки. Куртка прямого силуэта на подкладке из термосинтепона. Рукава с трикотажными напульсниками с внутренней стороны. Воротник отложной.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Мастер- Люкс светло - серый - красный с СВП(СОП)",
//   img: "/products/overalls/4.jpg",
//   price: 3990,
//   inStock: true,
//   detailed: "ГОСТ: ТР ТС 019/2011; Р 12.4.280-2014 Материал: смесовая ткань ERGOstuff Плюс  Плотность: 240 г/м2  Состав:35% хлопок + 65% полиэфир  Вес товара:1.232 кг. Объем: 0.004 куб.м",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Профессионал женский красный-светло-серый",
//   img: "/products/overalls/5.jpg",
//   price: 990,
//   inStock: true,
//   detailed: "Защитные свойства: ГОСТ: ТР ТС 019/2011; 12.4.280-2014, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.14 кг., Объем: 0.003 куб.м.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Профессионал-1 темно-серый со светло-серым",
//   img: "/products/overalls/6.jpg",
//   price: 4740,
//   inStock: true,
//   detailed: "Защитные свойства: ГОСТ: ТР ТС 019/2011; 12.4.280-2014, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.284 кг., Объем: 0.003 куб.м.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Профессионал-2 василек-черный-лимон",
//   img: "/products/overalls/7.jpg",
//   price: 4824,
//   inStock: false,
//   detailed: "Защитные свойства: ГОСТ: 12.4.280-2014; ТР ТС 019/2011, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.332 кг., Объем: 0.003 куб.м.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Профессионал-2 с СВП (СОП) оранжево-черный",
//   img: "/products/overalls/8.jpg",
//   price: 4890,
//   inStock: false,
//   detailed: "Защитные свойства: ГОСТ: 12.4.281-2014; 12.4.280-2014; ТР ТС 019/2011, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.392 кг., Объем: 0.004 куб.м.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм сигнальный Дорожник Флюр",
//   img: "/products/overalls/9.jpg",
//   price: 1898,
//   inStock: true,
//   detailed: "Защитные свойства: ГОСТ: Р 12.4.219-99; Р 12.4.280-2014; Р 12.4.281-2014, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.164 кг., Объем: 0.003 куб.м.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Ультра зимний красно-черный",
//   img: "/products/overalls/10.jpg",
//   price: 10500,
//   inStock: true,
//   detailed: "ГОСТ: 12.4.303-2016; ТР ТС 019/2011; 12.4.288-2013, Материал: Таслан + Оксфорд 600Pu Жаккард, Плотность: 100 г/м2 / 210 г/м2, Состав: 100% полиэфир, Утеплитель: термоскреплённый синтепон: куртка 300 г/м2 п/комб. 300 г/м2, Климатический пояс: III пояс, Вес товара: 3.02 кг., Объем: 0.05 куб.м.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм Эксперт-2 женский бордовый",
//   img: "/products/overalls/11.jpg",
//   price: 894,
//   inStock: true,
//   detailed: "Защитные свойства: ГОСТ: 12.4.280-2014; ТР ТС 019/2011, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 0.904 кг., Объем: 0.003 куб.м.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Костюм 'Эксперт-2' зеленый",
//   img: "/products/overalls/12.jpg",
//   price: 3528,
//   inStock: true,
//   detailed: "Защитные свойства: ГОСТ: 12.4.280-2014; ТР ТС 019/2011, Материал: смесовая ткань ERGOstuff Плюс, Плотность: 240 г/м2, Состав: 35% хлопок + 65% полиэфир, Вес товара: 1.52 кг., Объем: 0.002 куб.м.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Спецодежда',
// },
// {
//   id: uuidv4(),
//   name: "Газонокосилка бензиновая Patriot PT 40, 3,5 л.с, 35 л",
//   img: "/products/for-home-and-cottage/1.jpg",
//   price: 13530,
//   inStock: true,
//   detailed: "Бензиновая газонокосилка - агрегат для ухода за газоном на частном участке. Комбинированный травосборник объемом 35 л отличается простотой опустошения. Регулируемая высота скашивания позволяет подстригать газон на любую необходимую высоту. Для компактности хранения и транспортировки предусмотрена складная рукоятка. Комплектация: - Газонокосилка с установленным ножом - 1 шт; - Травосборник - 1 шт; - Клипса крепления троса - 1 шт; - Ключ свечной - 1 шт; - Рукоятка верхняя - 1 шт; - Рукоятка нижняя - 2 шт; - Барашковые гайки - 2 шт; - Болт соединения рукояток - 2 шт.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Грабли веерные Fiskars Solid, с деревянным черенком, 1840 мм",
//   img: "/products/for-home-and-cottage/2.jpg",
//   price: 1855,
//   inStock: true,
//   detailed: "Преимущества: Деревянный черенок; Металлические зубцы очень прочные и гибкие. Подойдут для уборки листвы, травы и другого садового мусора. Материал черенка: дерево; Материал рабочей части: металл; Ширина рабочей части: 510 мм; Длина: 1840 мм; Количество зубьев: 22; Вес: 800 г.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Качели садовые Olsa Стандарт Nova, трехместные, 231 x 126 x 147,8 см, каркас бордовый",
//   img: "/products/for-home-and-cottage/3.jpg",
//   price: 24098,
//   inStock: true,
//   detailed: "Трехместные садовые качели. Тент защищает от осадков и солнца. Мягкий матрасик добавляет комфорта в использовании. Механизм наклона: звеньями цепи на требуемый угол наклона, с фиксацией в горизонтальном положении. Не рекомендуется: - Перегружать качели сверх указанной нормы; - Вставать на дужки сиденья и боковые стяжки ногами; - Раскачивать качели в поперечном качанию направлении; - При сильном ветре необходимо снять тент; - Не допускается эксплуатация с ослабленными (не затянутыми) резьбовыми креплениями, либо без них. Предназначены для отдыха и разнообразия летнего досуга на природе. Допустимая нагрузка: 210 кг; Регулировка спинки: есть; Подушки: есть; Механизм наклона: есть; Размер в собранном виде: 231 x 126 x 147,8 см; Материал каркаса: стальная труба d 45 мм; Материал основания сиденья: оцинкованная сетка; Цвет каркаса: бордовый; Цвет ткани: бордовый, бежевый; Дизайн: полоска.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Комплект для капельного полива Жук, от емкости, 60 растений",
//   img: "/products/for-home-and-cottage/4.jpg",
//   price: 5800,
//   inStock: true,
//   detailed: "Прикорневой капельный полив от емкости полностью готов к работе. Используется в парниках и теплицах, а также на открытом грунте. Комплектация: - Штуцер присоединения к емкости - 1 шт; - Шланг магистральный 18 м; - Трубка уровень прозрачная 1 м; - Подвес для трубки уровня - 1 шт; - Шланг подающий 40 см - 60 шт; - Капельницы - 60 шт; - Тройник малый - 30 шт; - Кран - 3 шт; - Уголок для магистрального шланга - 3 шт; - Тройник большой - 3 шт; - Заглушка для магистрального шланга - 3 шт; - Прижим для магистрального шланга - 16 шт; - Шило для магистрального шланга - 1 шт; - Штуцер 1/2 (для соединения с емкостью) - 1 шт; - Штуцер 3/4 (для монтажа фильтра) - 2 шт; - Фильтр тонкой очистки - 1 шт; - Инструкция по монтажу.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Лопата штыковая для земляных работ Fiskars Solid Prof, с черенком и ручкой, 1120 мм",
//   img: "/products/for-home-and-cottage/5.jpg",
//   price: 1620,
//   inStock: true,
//   detailed: "Преимущества: - Лезвие из финской стали, легированной бором для износостойкости; - Закаленное лезвие придает лопате дополнительную прочность; - Оптимальная твердость лезвия обеспечивает длительный срок эксплуатации; - Угол наклона черенка к лезвию позволяет уменьшить нагрузку на спину и руки, обеспечивая естественное положение тела в процессе работы; - Пластиковое покрытие черенка для удобного захвата; - Надежное сварное соединение лезвия и черенка; - Эргономичная рукоятка для комфортной работы. Лопата предназначена для тяжелых работ в саду. Лопата для земляных работ подходит для выкапывания траншей, компостных ям, септиков и др. Материал черенка: сталь с покрытием; Материал рабочей части: сталь; Размер рабочей части: 280 x 210 мм; Длина: 1120 мм.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Опрыскиватель Жук Электро Классик, аккумуляторный, ранцевый, 12 л",
//   img: "/products/for-home-and-cottage/6.jpg",
//   price: 5739,
//   inStock: true,
//   detailed: "Преимущества: - Электрическая часть расположена сбоку и не намокнет, даже если поставить опрыскиватель в неглубокую лужу; - Прочный выдувной бак как у всех опрыскивателей серии Классик; - Ёмкость бака 12 литров – оптимальная для всех видов работ; - Информативный индикатор заряда аккумуляторной батареи, одинаково понятный опытным пользователям (индуцирует напряжение в вольтах) и новичкам; - Время работы опрыскивателя до 4 часов (в лаборатории производителя); - Удлиненный шланг брандспойта опрыскивателя - 1,5 метра; - Мягкая спинка и прочные ремни крепления на спину – для комфортной продолжительной работы с опрыскивателем; - Производительность – 3,1 литра в минуту: оптимальная для большинства задач.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Парник Palisad СУФ 90, с чехлом на молнии, 300 x 110 см",
//   img: "/products/for-home-and-cottage/7.jpg",
//   price: 3385,
//   inStock: true,
//   detailed: "Нетканый укрывной материал (суф) для защиты растений от прямых солнечных лучей и сильных осадков с хорошей свето- и влагопроницаемостью, предотвращает нападение вредителей. Входные отверстия с застежками-молниями для быстрого доступа и проветривания. Установка легкая, не требует особых навыков. Подходит для личного подсобного хозяйства. Материал тента: суф, материал каркаса: пластик. Площадь: 3,3 м², размеры: 300x110x120 см, вес: 4,1 кг",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Удобрение гранулированное Bona Forte для пионов и роз,",
//   img: "/products/for-home-and-cottage/8.jpg",
//   price: 250,
//   inStock: true,
//   detailed: "Без хлора. Внесение 1 раз в сезон. Увеличивает количество соцветий на 45% и стимулирует длительное и пышное цветение. Препятствует осыпанию бутонов и увеличивает их размер.Применяется для пересадки и подкормки цветочных культур. Состав: азот, фосфор, калий, биодоступный кремний, магний, кальций, микроэлементы. Содержит комплекс витаминов: C, B1, B6, B12, PP. Стимулятор роста: янтарная кислота. Объём: 1 л.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Удобрение жидкое Bona Forte для хвойных растений, 1,5 л",
//   img: "/products/for-home-and-cottage/9.jpg",
//   price: 902,
//   inStock: true,
//   detailed: "Удобрение жидкое Bona Forte, 1,5 л. Подходит для елей, сосен, кипарисов, тиса, кедра, можжевельника, туи, пихты, лиственницы и других хвойных растений. Препятствует покоричневению хвои, поддерживает зеленый цвет иголок, стимулирует рост и развитие корневой системы. Можно использовать с эжектором. Состав: азот, фосфор, калий, магний, микроэлементы, витамины.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Шланг для полива Вихрь, 12, 25 м, зеленый",
//   img: "/products/for-home-and-cottage/10.jpg",
//   price: 1205,
//   inStock: true,
//   detailed: "Шланг для полива садовый, 25 м, диаметр 12 мм (1/2). Выполнен из трех слоев армированного синтетической нитью ПВХ, обеспечивающих износостойкость, гибкость и устойчивость к воздействию солнца. Безопасен для окружающей среды и человека, не содержит вредных примесей. Сохраняет гибкость и не перекручивается при использовании. Максимальное давление - 10 бар. Предназначен для полива почвы на садовых и парковых участках. Температура эксплуатации: от -10 до +60 °C. Цвет: зеленый.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Для дома и дачи',
// },
// {
//   id: uuidv4(),
//   name: "Эмаль ПФ-115 черная 0,8кг ",
//   img: "/products/painting-supplies/1.jpg",
//   price: 204,
//   inStock: true,
//   detailed: "Эмаль ПФ-115 ВИТeko для внутренних и наружных работ, растворитель: органический, фасовка 0,8 кг, 1,8 кг, 2,6 кг, 5 кг, 10 кг, 20 кг, 60 кг, гарантийный срок – 18 мес., традиционная эмаль на основе высококачественного отечественного сырья, назначение: для окраски металлических, деревянных и других поверхностей, подвергающихся атмосферным воздействиям, и для окраски внутри помещений (кроме окраски пола), способ применения: поверхность перед окрашиванием высушить, предварительно очистить от пыли, жировых и других загрязнений, ржавчины, окалины. Перед применением эмаль тщательно перемешать, при необходимости разбавить сольвентом, уайт-спиритом, скипидаром или их смесью 1:1. При окрашивании больших площадей рекомендуется использовать эмаль одной партии, способ нанесения: кистью, валиком или краскораспылителем, время высыхания каждого слоя эмали при температуре (20±2)°С – 24 часа, расход на однослойное покрытие 90-180 г/м2 в зависимости от цвета, состав алкидный лак, олифа, пигменты, наполнители, растворители, сиккатив.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Эмаль витеко ПФ-115 1,8 кг коричневый",
//   img: "/products/painting-supplies/2.jpg",
//   price: 346,
//   inStock: true,
//   detailed: "Эмаль ПФ-115 предназначена для обработки металлических, деревянных, бетонных и других поверхностей, подвергающихся атмосферным воздействиям, а также для окраски внутри помещений (кроме пола). Способ применения: Поверхность перед окрашиванием высушить, предварительно очистить от пыли, жировых и других загрязнений, ржавчины, окалины. Перед использованием эмаль тщательно перемешать, при необходимости разбавить сольвентом, уайт-спиритом, скипидаром или их смесью 1:1. Состав равномерно распределяется по основанию при помощи кисти, валика или краскораспылителя. Время высыхания каждого слоя эмали при температуре (20±2) градуса 24 часа. Расход на однослойное покрытие: от 90 до 180 г/кв. м. состав: алкидный лак, олифа, пигменты, наполнители, растворители, сиккатив",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Бюгель для малярного валика 250мм (толщ 8мм)",
//   img: "/products/painting-supplies/3.jpg",
//   price: 317,
//   inStock: true,
//   detailed: "Бюгель/ручка для валиков — комплектующая часть для разборного малярного инструмента. Втулка валика насаживается на изогнутый стальной штырь. Валик легко заменяется на новый. Имеется удобная нескользящая ручка из полипропилена. Особенности: длина — 250 мм; предназначен для валиков с втулкой диаметром не более 8 мм; цвет ручки — синий; легкий по весу и удобный в руке. Характеристики: Цветовая палитра: Синий, Основной материал: Полипропилен, Страна производства: Китай, Материал крепления: Сталь, Ручка: Да, Тип древесины: Без древесины, Тип упаковки: Без упаковки, Тип продукта: Бюгель/ручка, Гарантия (лет): 0, Длина (мм): 250, Материал ручки: Полипропилен, Количество в наборе: 1, Материал волокна: Полиэстер, Общая длина (см): 30, Вес, кг: 0.237.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Валик структурный мозаика пластик белый EG720-7",
//   img: "/products/painting-supplies/4.jpg",
//   price: 1980,
//   inStock: true,
//   detailed: "Валик структурный мозаика пластик белый EG720-7 предназначен для нанесения структурных красок и штукатурок для придания поверхности фактурного зернистого покрытия. Рекомендуется для работы со структурными красками и штукатурками. Валик изготовлен из пластика, оснащен ручкой, с ним легко и удобно работать. Бренд: MAGtools, Страна производства: Китай, Диаметр стержня, мм: 6, Диаметр валика, мм: 60, Ширина валика, мм: 180, Материал валика: пластик, Количество в упаковке, шт.: 1, Минимальная продажа: поштучно.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Карандаш малярный, 12 шт, 180 мм, двухцветный, Startul, Master, ST4306-12",
//   img: "/products/painting-supplies/5.jpg",
//   price: 151,
//   inStock: true,
//   detailed: "Карандаш разметочный STARTUL является незаменимым аксессуаром для любого домашнего мастера и строителя-профессионала. Карандаш разметочный графитный используется при разметочных работах. Данный карандаш оснащен грифелем прямоугольного профиля, что позволяет наносить разметочную линию нужной толщины. Вы можете приобрести «Карандаш малярный, 12 шт, 180 мм, двухцветный, Startul, Master, ST4306-12» и другие товары в нашем интернет-магазине в Курске по низким ценам и с бесплатным самовывозом",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "КЮВЕТЫ МАЛЯРНЫЕ",
//   img: "/products/painting-supplies/6.jpg",
//   price: 101,
//   inStock: true,
//   detailed: "Ванночка предназначена для набора и равномерного распределения лакокрасочного материала по поверхности малярного валика.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Лента малярная (48 мм х 45 м)",
//   img: "/products/painting-supplies/7.jpg",
//   price: 287,
//   inStock: true,
//   detailed: "Описание: самоклеящаяся бумажная малярная лента. Сфера применения: используется при проведении малярных, покрасочных, штукатурных и любых других видов работ, где необходимо добиться ровных линий, а также не допустить смешивания различных цветов краски; упаковка товаров, посылок и проч; маркировка продукции на производствах и складах; утепление помещений на осенне-зимний период; защита стеклянных поверхностей от сколов и царапин; оклейка острых краев различных предметов из металла, стекла и других материалов. Свойства: высокая адгезия к металлам, шпатлевкам, отделочным материалам; после удаления не оставляет следов клея; стойкая к воздействию растворителей; морозостойкая; подходит для использования на любых поверхностях, в том числе негладких и пористых; может использоваться для нанесения надписей карандашом, ручкой, маркером.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Маркер строительный перманентный черный",
//   img: "/products/painting-supplies/8.jpg",
//   price: 245,
//   inStock: true,
//   detailed: "Перманентный маркер предназначен для разметки и нанесения надписей на всех поверхностях. Недорогой маркер с хорошим ресурсом. Характеристика: Длина 140 мм, Цвет черный, Максимальная толщина линии 3 мм, Количество в наборе 10, Вес нетто 0.013 кг, Габариты без упаковки 140 х 15 мм.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Шпатель малярський MASTERTOOL польський 150 мм",
//   img: "/products/painting-supplies/9.jpg",
//   price: 688,
//   inStock: true,
//   detailed: "A: 90 MM B: 100 MM C: 230 MM Производится из нержавеющей и пружинистой стали. Для облегчения применения и приобретения гибкости, на поверхности стали выполнена коническая расточка. Применяется для шпатлевки и штукатурных работ разного рода. Модели из нержавеющей стали шпателей могут использоваться в пищевой деятельности.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Малярные товары',
// },
// {
//   id: uuidv4(),
//   name: "Угловая шлифмашина ALTECO AG 750-115",
//   img: "/products/electrical/1.jpg",
//   price: 2992,
//   inStock: true,
//   detailed: "Угловая шлифмашина ALTECO AG 750-115 применяется для различных видов работ по шлифованию и резанию металлов и других материалов. Инструмент оснащен двигателем мощностью 750 Вт. Для работы применяются",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Гайковерт угловой - трещётка аккумуляторный бесщёточный DeWALT DCF512D1G",
//   img: "/products/electrical/2.jpg",
//   price: 32790,
//   inStock: false,
//   detailed: "Ищете высококачественную, удобную и производительную аккумуляторную трещотку? Dewalt DCF512D1 станет отличным выбором! Благодаря эргономичной и компактной конструкции этот инструмент идеально подходит для выполнения сложных работ в узких и труднодоступных местах. Трещотка Dewalt DCF512D1 не только удобна в использовании, но и производительна, благодаря максимальному крутящему моменту 95 Н/м, позволяет быстро справиться даже с самыми сложными задачами. Конструкция с питанием от батареи устраняет необходимость в шнурах или кабелях, а входящие в комплект батарея и чехол для переноски позволяют легко держать все в порядке и готовым к использованию. Так что, если вы готовы вывести свою работу на новый уровень, обязательно ознакомьтесь с Dewalt DCF512D1. Этот инструмент, обладающий превосходными характеристиками и дополнительным удобством, незаменим для всех, кто хочет выполнить работу правильно с первого раза. Закажите сегодня и убедитесь в непревзойденном качестве инструментов Dewalt!",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Аккумуляторная отвертка ВИХРЬ ОА-3,6-К",
//   img: "/products/electrical/3.jpg",
//   price: 2490,
//   inStock: true,
//   detailed: "Аккумуляторная отвертка ручного типа Вихрь ОА-3,6-ТФ - это компактный инструмент, предназначенный для монтажа разнообразных крепежных элементов. Значение максимального крутящего момента составляет 5 Нм. В сочетании со скоростью вращения 250 об/мин это позволяет использовать прибор для решения ежедневных бытовых задач. Литий-ионный тип встроенного аккумулятора емкостью 1,5 А*ч обеспечивает высокую производительность работы. Время полного его заряда составляет 3 ч. Функция регулирования момента затяжки позволяет контролировать интенсивность воздействия в зависимости от используемого материала. Это особенно важно при сборке мебели. Аккумуляторная отвертка Вихрь ОА-3,6-ТФ имеет компактные размеры и малый вес 0,5 кг. Эргономичная рукоятка-трансформер позволяет менять положение для удобной работы и более надежного захвата. Таким образом пистолетная форма может приобретать вид прямой отвертки. Наличие фонарика делает возможным использование инструмента в недостаточно освещенных зонах. Функция реверса предназначена для откручивания шурупов. В комплектацию входит набор бит и торцевых головок. Для удобства хранения и транспортировки инструмента и оснастки предусмотрен прочный пластиковый кейс. Напряжение сети адаптера питания, В, Гц -220-230В ~50Гц Напряжение аккумулятора, В -3.6 Тип аккумулятора -Li-Ion Емкость аккумулятора, А*ч -1.5 Время заряда аккумулятора, ч -3 Максимальный крутящий момент, Нм -5 Частота вращения, об/мин -250 Режим реверса -Есть Регулировка момента затяжки -Есть Подсветка рабочей зоны -Да Рукоятка трансформер -Да Наличие прорезиненной ручки -Да Фонарик в рукоятке -Да Кейс -да Бренд -Вихрь Габариты упаковки -0.158 × 0.158 × 0.158 м Вес, кг -1.31 кг",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Дрель-шуруповерт аккумуляторная ДА-24-2ЛК Ресанта",
//   img: "/products/electrical/4.jpg",
//   price: 9190,
//   inStock: true,
//   detailed: "Дрель-шуруповерт аккумуляторная ДА-24-2ЛК Ресанта – незаменимый помощник мастера в ремонте или строительстве. Электроинструмент является аналогом модели ДА-24Л-2, отличие: есть кейс и второй аккумулятор. Прибор аккуратно сверлит отверстия на поверхностях из дерева и металла, а также накрепко закручивает шурупы. В комплект к дрели-шуруповерту поставляется удобный кейс, в котором можно хранить инструмент, зарядку к нему и другие рабочие детали.",
//   isNew: false,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Фен технический DWT HLP20-650 K",
//   img: "/products/electrical/5.jpg",
//   price: 3029,
//   inStock: true,
//   detailed: "Технический фен DWT HLP20-600 K BMC 5.1.47 предназначен для широкого спектра работ: сушки, пайки, лужения и др. Возможность регулировки температуры и потока воздуха (3 ступени) позволяет достичь отличных результатов. Корпус промышленного фена выполнен из прочного термостойкого пластика для долгого срока службы. В комплекте прилагается пластиковый кейс, что решает вопрос хранения и транспортировки инструмента.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Степлер электрический ",
//   img: "/products/electrical/6.jpg",
//   price: 3802,
//   inStock: true,
//   detailed: "Степлер электрический Dexter Power 53/8/9. Это модель работает от электрической сети. В качестве расходного материала используются узкие скобы типа 53 и гвозди (№8 и №9). С таким инструментом работать легко: требуются минимальные мускульные усилия, удается пробить более твердые материалы. Пластиковый эргономичный корпус делает степлер относительно легким (его вес 1,3 кг).",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Бита для шуруповерта магнитная PH2*50мм (10шт.) Econom Strong СТП-93100050",
//   img: "/products/electrical/7.jpg",
//   price: 269,
//   inStock: true,
//   detailed: "Магнитные биты Strong являются сменными насадками для шуруповерта и дрели и используются при закручивании шурупов, саморезов, винтов со шлицем PH (PHILLIPS). Изготовлены из хромованадиевой стали CrV. Биты эконом класса, предназначены для бытового применения.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },
// {
//   id: uuidv4(),
//   name: "Отвертка matrix Fusion PH2x200мм",
//   img: "/products/electrical/8.jpg",
//   price: 91,
//   inStock: true,
//   detailed: "Жало отвертки изготовлено из легированной стали CrV, прошедшей термообработку. Эргономичная трехкомпонентная рукоятка antislip обеспечивает удобный захват и эффективное вращение отвертки.",
//   isNew: true,
//   total: 0,
//   quantity: 0,
//   categories: 'Электрооборудование',
// },

// ];

// регистрация и логин

app.get('/', (req: Request, res: Response) => {
  res.send('hello server')
})
// app.get('/history-of-order', async (req: Request, res: Response) => {
//   const historu = await db.query('SELECT * FROM history_of_order')
//   res.send(historu.rows)
// })
// app.post('/create-history-order', (req: Request, res: Response) => {
//   const { id, orderNumber, created, received, purchases, orders, deliveryInfo, payments } = req.body;
//   const purchasesJson = JSON.stringify(purchases);
//   const ordersJson = JSON.stringify(orders);
//   const deliveryInfoJson = JSON.stringify(deliveryInfo);
//   const paymentsJson = JSON.stringify(payments);
  
//   const query = 'INSERT INTO history_of_order (id, "orderNumber", created, received, purchases, orders, "deliveryInfo", payments) VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb)';
//   const values = [id, orderNumber, created, received, purchasesJson, ordersJson, deliveryInfoJson, paymentsJson];

//   db.query(query, values, (error: string) => {
//     if (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ error: 'An error occurred while processing your request.' });
//     } else {
//       res.status(200).json({ message: 'Order added successfully.' });
//     }
//   });
// });

// app.get('/history-of-orders', (req: Request, res: Response) => {
//   res.send(HistoryOfOrders)
// })

// app.post('/create-history-of-orders', async (req: Request, res: Response) => {
// const newBody = {
  // id: uuidv4(),
  // orderNumber: HistoryOfOrders.length + 1,
  // created: moment().subtract(10, "days").calendar(),
  // received: moment().subtract(10, "days").calendar(),
  // purchases: [...productsFromCart],
  // orders: [...orders],
  // deliveryInfo: [...deliveryInfo],
  // payments: [...payments]
// };

//   HistoryOfOrders.push(newBody);
// orders.length = 0;
// deliveryInfo.length = 0;
// payments.length = 0;
// productsFromCart.length = 0;

//   res.send('продукт успешно создан');
// });



// app.post('/create-order', (req: Request, res: Response) => {
//   const newProduct = req.body;
//   orders.push(newProduct);
//   res.send('продукт успешно создан')
// })

// app.get('/delivery-info', (req: Request, res: Response) => {
//   res.send(deliveryInfo)
// })

// app.post('/create-delivery-info', (req: Request, res: Response) => {
//   const newDelivery = req.body;
//   deliveryInfo.push(newDelivery);
//   res.send('доставку успешно добавлен')
// })

// app.post('/create-payment', (req: Request, res: Response) => {
//   const newPayment = req.body;
//   payments.push(newPayment);
//   res.send('оплата успешно выполнен')
// })

// app.post('/create-product-from-cart', (req: Request, res: Response) => {
//   const newProduct = req.body;
//   productsFromCart.push(...newProduct);
//   res.send('продукт успешно добавлен')
// })

// app.use('/users', userRoutes);
// app.use('/contacts', contactsRoutes);
// app.use('/', messageRoutes)

app.use('/', productRoutes)
app.use('/', userRouter)





// Здесь массивы каталогов



// app.get('/painting-supplies', (req: Request, res: Response) => {
//   const paintingSupplies = products.filter(product => product.categories === 'Малярные товары');
//   res.send(paintingSupplies)
// })

// app.get('/overalls', (req: Request, res: Response) => {
//   const paintingSupplies = products.filter(product => product.categories === 'Спецодежда');
//   res.send(paintingSupplies)
// })

// app.get('/electrical', (req: Request, res: Response) => {
//   const paintingSupplies = products.filter(product => product.categories === 'Электрооборудование');
//   res.send(paintingSupplies)
// })

// app.get('/for-home-and-cottage', (req: Request, res: Response) => {
//   const paintingSupplies = products.filter(product => product.categories === 'Для дома и дачи');
//   res.send(paintingSupplies)
// })

// app.get('/products', (req: Request, res: Response) => {
//   res.send(products)
// })

// app.get('/products/:id', (req: Request, res: Response) => {
//   const { id } = req.params
//   const findProduct = products.find(product => product.id === id)
//   res.send(findProduct)
// })
// app.get('/stocks-products', (req: Request, res: Response) => {
//   const filterProduct = products.filter(product => product.isNew === false)
//   res.send(filterProduct)
// })

// app.get('/new-products', (req: Request, res: Response) => {
//   const filterProduct = products.filter(product => product.isNew === true)
//   res.send(filterProduct)
// })
// app.post('/create-product', (req: Request, res: Response) => {
//   const newProduct = req.body;
//   products.push(newProduct);
//   res.send('продукт успешно добавлен')
// })

// app.put('/edit-product/:id', (req: Request, res: Response) => {
//   const { id } = req.params;
//   const updatedProduct = req.body;
//   const productIndex = products.findIndex((product) => product.id === id);
//   if (productIndex !== -1) {
//     products[productIndex] = { ...products[productIndex], ...updatedProduct };
//     res.send('Продукт успешно обновлен');
//   } else {
//     res.status(404).send('Продукт не найден');
//   }
// });

// app.delete('/delete-product/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     products.filter(product => product.id !== id)
//     res.json({ message: 'Сообщение успешно удалено' });
//   } catch (error) {
//     console.error('Ошибка при выполнении запроса:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });

const regstration: IRegistration[] = [
  {
    id: uuidv4(),
    lastName: 'Гадойбоев',
    name: "Искандар",
    phone: "+992929445515",
    email: 'zed1211@mail.ru',
    password: 'asdqwe',
    confirmPassword: "asdqwe",
    role: 'admin',
    code: '5432'
  }
];


// app.post('/registration', async (req: Request, res: Response) => {
//   try {
//     const { id, lastName, name, phone, email, password, confirmPassword, role, code } = req.body;
//     const query = 'INSERT INTO users (id, "lastName", name, phone, email, password, "confirmPassword", role, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
//     const values = [id, lastName, name, phone, email, password, confirmPassword, role, code];
//     await db.query(query, values);
//     res.send('Регистрация успешно завершена');
//   } catch (error) {
//     console.error('Ошибка при регистрации пользователя:', error);
//     res.status(500).send('Произошла ошибка при регистрации пользователя');
//   }
// });
// app.delete('/delete-user/:id', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     // Выполните запрос DELETE для удаления пользователя из таблицы users по id
//     const query = 'DELETE FROM users WHERE id = $1';
//     const values = [id];
//     await pool.query(query, values);

//     res.json({ message: 'Пользователь успешно удален' });
//   } catch (error) {
//     console.error('Ошибка при удалении пользователя:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });

// app.get('/get-testing', async (req: Request, res: Response) => {
//   try {
//     // Выполните запрос SELECT для получения списка зарегистрированных пользователей
//     const query = 'SELECT * FROM products_from_сart';
//     const result = await db.query(query);
//     const users = result.rows;
//     res.json(users);
//   } catch (error) {
//     console.error('Ошибка при получении списка регистрации:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });

// app.post('/post-code', async (req: Request, res: Response) => {
//   const { newPhone } = req.body;
//   try {
//     // Выполните запрос SELECT для проверки наличия пользователя с указанным номером телефона
//     const query = 'SELECT * FROM users WHERE phone = $1';
//     const values = [newPhone];
//     const result = await pool.query(query, values);
//     const user = result.rows[0];

//     if (user) {
//       res.send('Номер телефона подтвержден');
//     } else {
//       res.send('Пользователь с указанным номером телефона не найден');
//     }
//   } catch (error) {
//     console.error('Ошибка при выполнении запроса:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });

// app.post('/post-code-confirm', async (req: Request, res: Response) => {
//   const { testingCode } = req.body;
//   try {
//     // Выполните запрос SELECT для проверки наличия пользователя с указанным кодом
//     const query = 'SELECT * FROM users WHERE code = $1';
//     const values = [testingCode];
//     const result = await pool.query(query, values);
//     const user = result.rows[0];

//     if (user) {
//       res.send('Вход выполнен');
//     } else {
//       res.send('Неверный код подтверждения');
//     }
//   } catch (error) {
//     console.error('Ошибка при выполнении запроса:', error);
//     res.status(500).json({ error: 'Внутренняя ошибка сервера' });
//   }
// });



app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
