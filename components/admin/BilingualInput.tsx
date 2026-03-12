"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  label: string;
  valueTh: string;
  valueEn: string;
  onChangeTh: (v: string) => void;
  onChangeEn: (v: string) => void;
  multiline?: boolean;
  rows?: number;
};

export default function BilingualInput({
  label,
  valueTh,
  valueEn,
  onChangeTh,
  onChangeEn,
  multiline = false,
  rows = 3,
}: Props) {
  const Component = multiline ? Textarea : Input;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{label}</Label>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label className="text-xs text-muted-foreground">ไทย (TH)</Label>
          <Component
            value={valueTh}
            onChange={(e) => onChangeTh(e.target.value)}
            {...(multiline ? { rows } : {})}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">English (EN)</Label>
          <Component
            value={valueEn}
            onChange={(e) => onChangeEn(e.target.value)}
            {...(multiline ? { rows } : {})}
          />
        </div>
      </div>
    </div>
  );
}
