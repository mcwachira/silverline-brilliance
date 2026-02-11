import ContactHero from "@/src/components/contact/ContactHero";
import ContactInfo from "@/src/components/contact/ContactInfo";
import ContactSidebar from "@/src/components/contact/ContactSidebar";

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ContactInfo />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/*<ContactForm />*/}
            <ContactSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
