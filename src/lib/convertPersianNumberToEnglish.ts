function persianToEnglishNumbers(inputStr: string): string {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const translationMap: { [key: string]: string } = {};
  persianNumbers.forEach((persian, index) => {
    translationMap[persian] = englishNumbers[index];
  });

  return inputStr.replace(/[۰-۹]/g, (match) => translationMap[match]);
}
export default persianToEnglishNumbers;
