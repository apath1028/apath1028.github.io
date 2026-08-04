const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatPassageDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = defaultDateOptions,
) {
  return date.toLocaleDateString("zh-CN", {
    ...options,
    timeZone: "UTC",
  });
}

export function passageDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}
