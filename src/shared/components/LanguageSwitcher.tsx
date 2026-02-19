import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/lib/i18n/translations";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={t("common.language")}
          className={["rounded-full border border-border", className].filter(Boolean).join(" ")}
        >
          <Globe className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang as Language)}
            className="justify-between"
          >
            {LANGUAGE_LABELS[lang]}
            {language === lang && <Check className="h-3.5 w-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
