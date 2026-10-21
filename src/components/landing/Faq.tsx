import { hooks } from "@/data/hooks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export function Faq() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-20 max-w-[900px] border-t border-border/60 pt-14">
      <h1 className="text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t('faq.title')}
      </h1>
      <h2 className="text-center p-2">{t('faq.subtitle')}</h2>
      <Accordion type="single" collapsible className="mt-10">
        {hooks.map(({ icon: Icon, question, answer }) => (
          <AccordionItem key={question} value={question} className="border-border/60">
            <AccordionTrigger className="gap-3 text-base text-foreground hover:no-underline">
              <span className="flex items-center gap-3 text-left">
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                {t(question)}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pl-7 text-muted-foreground">{t(answer)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
