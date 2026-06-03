import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What condition is the inventory in?",
    a: "Everything is in new or like-new condition. Each piece is physically inspected by Comeback Goods before it ships.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing depends on volume and mix. Most partners see up to 60–70% below wholesale. We provide a custom quote based on your volume tier and style preferences.",
  },
  {
    q: "What are the order minimums?",
    a: "Pallets have a $10,000 order minimum. The Rug Program has a $6,000 minimum. Lighting and Mirror programs have a $4,000 minimum.",
  },
  {
    q: "Can I choose specific styles or categories?",
    a: "Yes. During onboarding, you share your preferences and we curate shipments to match — by category, style, size, or finish.",
  },
  {
    q: "What's the minimum commitment?",
    a: "We ask for a 3-month initial commitment so we can dial in your preferences. After that, you can adjust volume, pause, or cancel with 30 days notice.",
  },
  {
    q: "How often do I receive shipments?",
    a: "Most partners receive monthly shipments, but bi-weekly or quarterly is available depending on your needs. Flexible scheduling is part of the program.",
  },
  {
    q: "What brands do you carry?",
    a: "We source from a rotating mix of premium home brands. Everything meets our quality standards and is evaluated before we ship. We're happy to share current brand availability during your consultation.",
  },
];

const HomepageFaqs = () => (
  <section className="pt-14 md:pt-20 pb-14 md:pb-20 bg-muted/30">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-left font-semibold text-base hover:no-underline [&[data-state=open]>svg]:text-accent">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default HomepageFaqs;
