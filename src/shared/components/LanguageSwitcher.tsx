import { Check, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n/I18nProvider";
import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/lib/i18n/translations";
import { isLocalizedPublicPath, stripLanguagePrefix, withLanguagePrefix } from "@/lib/i18n/url";
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
  const navigate = useNavigate();
  const location = useLocation();

  const moveToLanguagePath = (nextLanguage: Language) => {
    const currentPath = location.pathname || "/";
    if (!isLocalizedPublicPath(currentPath)) {
      return;
    }

    const stripped = stripLanguagePrefix(currentPath);
    const localizedPath = withLanguagePrefix(stripped, nextLanguage);
    navigate(`${localizedPath}${location.search}${location.hash}`);
  };

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
            onClick={() => {
              const nextLanguage = lang as Language;
              setLanguage(nextLanguage);
              moveToLanguagePath(nextLanguage);
            }}
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
