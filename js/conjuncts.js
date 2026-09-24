/**
 * Common Bengali Conjuncts (যুক্তবর্ণ) Reference Dataset for Government Typing Exams
 */

const BANGLA_CONJUNCTS = [
  { conjunct: "ক্ষ", breakdown: "ক + ষ", bijoy: "j + N", avro: "kkh / x", example: "শিক্ষা, পরীক্ষা" },
  { conjunct: "জ্ঞ", breakdown: "জ + ঞ", bijoy: "u + I", avro: "gg / jng", example: "জ্ঞান, বিজ্ঞান" },
  { conjunct: "হ্ম", breakdown: "হ + ম", bijoy: "i + m", avro: "hm", example: "ব্রাহ্মণ, ব্রহ্মপুত্র" },
  { conjunct: "ঞ্চ", breakdown: "ঞ + চ", bijoy: "I + y", avro: "nc", example: "পঞ্চম, অঞ্চল" },
  { conjunct: "ঞ্ছ", breakdown: "ঞ + ছ", bijoy: "I + Y", avro: "nch", example: "বাঞ্ছা" },
  { conjunct: "ঞ্জ", breakdown: "ঞ + জ", bijoy: "I + u", avro: "nj", example: "ব্যঞ্জন, জঞ্জাল" },
  { conjunct: "ঙ্ক", breakdown: "ঙ + ক", bijoy: "Q + k", avro: "ngk", example: "অঙ্ক, অঙ্কন" },
  { conjunct: "ঙ্গ", breakdown: "ঙ + গ", bijoy: "Q + o", avro: "ngg", example: "বঙ্গ, গঙ্গা" },
  { conjunct: "ঙ্ঘ", breakdown: "ঙ + ঘ", bijoy: "Q + O", avro: "nggh", example: "জঙ্ঘা, লঙ্ঘন" },
  { conjunct: "ষ্ণ", breakdown: "ষ + ণ", bijoy: "N + B", avro: "Shn", example: "কৃষ্ণ, উষ্ণ" },
  { conjunct: "ষ্ঠ", breakdown: "ষ + ঠ", bijoy: "N + T", avro: "ShTh", example: "শ্রেষ্ঠ, অনুষ্ঠান" },
  { conjunct: "ষ্ট", breakdown: "ষ + ট", bijoy: "N + t", avro: "ShT", example: "কষ্ট, নষ্ট" },
  { conjunct: "ষ্প", breakdown: "ষ + প", bijoy: "N + r", avro: "Shp", example: "পুষ্প, বাষ্প" },
  { conjunct: "স্ফ", breakdown: "স + ফ", bijoy: "m + M", avro: "sph", example: "স্ফীতি, স্ফটিক" },
  { conjunct: "স্থ", breakdown: "স + থ", bijoy: "m + K", avro: "sth", example: "স্থান, স্বাস্থ্য" },
  { conjunct: "স্ত", breakdown: "স + ত", bijoy: "m + k", avro: "st", example: "ব্যস্ত, পুস্তক" },
  { conjunct: "স্খ", breakdown: "স + খ", bijoy: "m + K", avro: "skh", example: "স্খলন" },
  { conjunct: "স্ক", breakdown: "স + ক", bijoy: "m + j", avro: "sk", example: "স্কুল, পুরস্কার" },
  { conjunct: "স্প", breakdown: "স + প", bijoy: "m + r", avro: "sp", example: "স্পষ্ট, স্পর্শ" },
  { conjunct: "স্ম", breakdown: "স + ম", bijoy: "m + m", avro: "sm", example: "স্মরণ, বিস্ময়" },
  { conjunct: "ত্র", breakdown: "ত + র-ফলা", bijoy: "k + z", avro: "tr", example: "ছাত্র, চরিত্র" },
  { conjunct: "ক্ত", breakdown: "ক + ত", bijoy: "j + k", avro: "kt", example: "রক্ত, ভক্তি" },
  { conjunct: "ক্র", breakdown: "ক + র-ফলা", bijoy: "j + z", avro: "kr", example: "চক্র, বিক্রম" },
  { conjunct: "ক্ল", breakdown: "ক + ল", bijoy: "j + v", avro: "kl", example: "ক্লান্ত, ক্লেশ" },
  { conjunct: "দ্ব", breakdown: "দ + ব-ফলা", bijoy: "l + w", avro: "dw", example: "দ্বার, দ্বিতীয়" },
  { conjunct: "দ্ধ", breakdown: "দ + ধ", bijoy: "l + L", avro: "ddh", example: "যুদ্ধ, বুদ্ধি" },
  { conjunct: "দ্ভ", breakdown: "দ + ভ", bijoy: "l + H", avro: "dbh", example: "উদ্ভিদ, অদ্ভুত" },
  { conjunct: "দ্ম", breakdown: "দ + ম", bijoy: "l + m", avro: "dm", example: "পদ্ম, ছদ্মবেশ" },
  { conjunct: "ত্ম", breakdown: "ত + ম", bijoy: "k + m", avro: "tm", example: "আত্মা, মহাত্মা" },
  { conjunct: "ত্ব", breakdown: "ত + ব-ফলা", bijoy: "k + w", avro: "tw", example: "দায়িত্ব, গুরুত্ব" },
  { conjunct: "ণ্ড", breakdown: "ণ + ড", bijoy: "B + e", avro: "ND", example: "কাণ্ড, পণ্ডিত" },
  { conjunct: "ণ্ঠ", breakdown: "ণ + ঠ", bijoy: "B + T", avro: "NTh", example: "কণ্ঠ, উৎকণ্ঠা" },
  { conjunct: "ন্ত", breakdown: "ন + ত", bijoy: "b + k", avro: "nt", example: "শান্ত, দিগন্ত" },
  { conjunct: "ন্থ", breakdown: "ন + থ", bijoy: "b + K", avro: "nth", example: "গ্রন্থ, পান্থ" },
  { conjunct: "ন্দ", breakdown: "ন + দ", bijoy: "b + l", avro: "nd", example: "সুন্দর, আনন্দ" },
  { conjunct: "ন্ধ", breakdown: "ন + ধ", bijoy: "b + L", avro: "ndh", example: "অন্ধ, বন্ধন" },
  { conjunct: "ম্ব", breakdown: "ম + ব", bijoy: "m + w", avro: "mb", example: "সম্বল, অম্বর" },
  { conjunct: "ম্ভ", breakdown: "ম + ভ", bijoy: "m + H", avro: "mbh", example: "সম্ভব, আরম্ভ" },
  { conjunct: "ম্ম", breakdown: "ম + ম", bijoy: "m + m", avro: "mm", example: "সম্মান, সম্মত" },
  { conjunct: "শ্র", breakdown: "শ + র-ফলা", bijoy: "S + z", avro: "sr / shr", example: "শ্রদ্ধা, পরিশ্রম" },
  { conjunct: "শ্ল", breakdown: "শ + ল", bijoy: "S + v", avro: "shl", example: "শ্লেষ, অশ্লীল" }
];

window.BANGLA_CONJUNCTS = BANGLA_CONJUNCTS;
