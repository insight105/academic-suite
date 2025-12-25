import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-[80px] px-2 justify-between">
                    <div className="flex items-center gap-2">
                        <Globe className="h-[1.2rem] w-[1.2rem]" />
                        <span className="text-sm font-medium">{i18n.language === 'id' ? 'ID' : 'EN'}</span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("id")}>
                    Bahasa Indonesia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
