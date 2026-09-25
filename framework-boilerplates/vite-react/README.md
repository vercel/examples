import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Separator } from "@/components/ui/separator"; import { Sparkles } from "lucide-react"; import Image from "next/image";

export default function HomePage() { return ( <div className="p-6 max-w-5xl mx-auto"> <header className="text-center space-y-4"> <h1 className="text-4xl font-bold tracking-tight"> Bling Bras & Custom Creations by Robin </h1> <p className="text-lg text-muted-foreground"> One-of-a-kind rhinestone bras, custom apparel, bling accessories & more. </p> <Button className="mt-4 text-base px-6 py-2">Shop Collection</Button> </header>

<Separator className="my-8" />

  <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <CardContent className="p-4 space-y-2">
        <Image
          src="/images/bling-bra.jpg"
          alt="Bling Bra"
          width={400}
          height={300}
          className="rounded-xl object-cover"
        />
        <h2 className="font-semibold text-xl">Custom Bling Bras</h2>
        <p className="text-muted-foreground text-sm">
          Designed to dazzle. Choose your color, size, and bling level.
        </p>
        <Button variant="outline">Customize Yours</Button>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4 space-y-2">
        <Image
          src="/images/custom-jackets.jpg"
          alt="Custom Jackets"
          width={400}
          height={300}
          className="rounded-xl object-cover"
        />
        <h2 className="font-semibold text-xl">Custom Apparel</h2>
        <p className="text-muted-foreground text-sm">
          Hoodies, jackets, and tees with your name, slogan, or design.
        </p>
        <Button variant="outline">Explore Styles</Button>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="p-4 space-y-2">
        <Image
          src="/images/bling-accessories.jpg"
          alt="Accessories"
          width={400}
          height={300}
          className="rounded-xl object-cover"
        />
        <h2 className="font-semibold text-xl">Bling Accessories</h2>
        <p className="text-muted-foreground text-sm">
          Custom cups, bags, and headwear to complete your look.
        </p>
        <Button variant="outline">See All</Button>
      </CardContent>
    </Card>
  </section>

  <Separator className="my-8" />

  <section className="text-center space-y-4">
    <h2 className="text-2xl font-semibold">Need Something Extra Custom?</h2>
    <p className="text-muted-foreground max-w-xl mx-auto">
      Submit your idea and let’s make it sparkle. From full event outfits to custom gift bundles.
    </p>
    <div className="flex justify-center gap-2">
      <Input placeholder="Your email" className="max-w-xs" />
      <Button className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Request a Custom Design
      </Button>
    </div>
  </section>
</div>

); }

