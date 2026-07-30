import { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import CustomSelect from "../../../../ui/CustomSelect";

dayjs.extend(utc);
dayjs.extend(timezone);

function formatOffset(minutes: number) {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

const tzOptions = Intl.supportedValuesOf("timeZone")
  .map((tz) => {
    const offset = dayjs().tz(tz).utcOffset();
    return { value: tz, label: `${tz} (${formatOffset(offset)})`, offset };
  })
  .sort((a, b) => a.offset - b.offset)
  .map(({ value, label }) => ({ value, label }));

type Props = {
  value?: string | null;
  onChange?: (tz: string) => void;
};

export default function TimezoneSelector({ value, onChange }: Props) {
  const [internalTz, setInternalTz] = useState<string | null>(null);

  const selectedTz = value ?? internalTz;
  const selectedOption = tzOptions.find((o) => o.value === selectedTz) ?? null;

  function handleChange(option: { value: string; label: string } | null) {
    if (!option) return;
    if (onChange) {
      onChange(option.value);
    } else {
      setInternalTz(option.value);
    }
  }

  return (
    <div>
      <CustomSelect
        required
        options={tzOptions}
        value={selectedOption}
        onChange={handleChange}
      />
    </div>
  );
}
