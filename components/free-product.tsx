import { products } from "@/lib/definitions";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageCarousel from "./ui/image-carousel";
import FooterForm from "./footer-form";

export default function FreeProduct({ product }: { product: products }) {
  const { name, description, gallery, features } = product;

  return (
    <>
      <div className="min-h-screen flex flex-col items-start w-full px-5 md:px-16">
        <h2 className="text-5xl font-bold capitalize mb-4">{name}</h2>
        <div className="w-full flex flex-col md:flex-row justify-center items-start gap-5">
          {/* left col */}
          <div className="w-full md:w-1/2 py-4 sm:pr-20">
            {gallery && (
              <ImageCarousel
                gallery={gallery}
                showNav={false}
                thumbnailPosition="left"
              />
            )}
          </div>

          {/* right col */}
          <div className="w-full md:w-1/2 h-full flex flex-col gap-10 py-4">
            <div className="h-full p-2">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger
                    value="description"
                    className="w-1/2 capitalize data-[state=active]:text-green-500 data-[state=active]:border-2 data-[state=active]:border-b-green-500"
                  >
                    description
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="w-1/2 capitalize data-[state=active]:text-green-500 data-[state=active]:border-2 data-[state=active]:border-b-green-500"
                  >
                    features
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="px-5 pt-4">
                  {description}
                </TabsContent>
                <TabsContent value="features" className="px-5 pt-4">
                  {features}
                </TabsContent>
              </Tabs>
            </div>
            <div className="px-5">
              <Link href={"#form"}>
                <Button
                  variant={"default"}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Enquiry
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div id="form" className="mt-20 pt-20 border-t-2 w-full">
          <FooterForm
            formTitle={product.serviceType ? "Get Quote" : "Contact Us"}
          />
        </div>
      </div>
    </>
  );
}
