import { Helmet } from "react-helmet-async";

const ComingSoon = () => (
  <>
    <Helmet>
      <title>Comeback — Coming Soon</title>
      <meta name="robots" content="noindex, nofollow" />
      <meta name="description" content="Comeback is launching soon." />
    </Helmet>
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-sm tracking-[0.3em] uppercase text-accent">Comeback</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">
          Coming soon.
        </h1>
        <p className="text-lg text-muted-foreground">
          We're putting the finishing touches on something good. Check back shortly.
        </p>
        <p className="text-sm text-muted-foreground pt-4">
          For inquiries: <a className="underline hover:text-accent" href="mailto:hello@comebackb2b.com">hello@comebackb2b.com</a>
        </p>
      </div>
    </main>
  </>
);

export default ComingSoon;
