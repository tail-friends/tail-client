const hasBatchim = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
};

// 받침이 있으면 을, 없으면 를 (한글이 아니면 를)
export default function eulReul(word: string) {
  return `${word}${hasBatchim(word) ? "을" : "를"}`;
}

export function waGwa(word: string) {
  return hasBatchim(word) ? "과" : "와";
}
