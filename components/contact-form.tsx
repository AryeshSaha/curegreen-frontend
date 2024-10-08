"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Checkbox } from "./ui/checkbox";
import { AllProducts } from "@/data/products";
import Link from "next/link";
import { useRef } from "react";
import { useToast } from "./ui/use-toast";
import emailjs from "@emailjs/browser";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  propertyType: z
    .object({
      isResidential: z.boolean(),
      isCommercial: z.boolean(),
    })
    .refine((data) => data.isResidential || data.isCommercial, {
      message: "You must choose at least one: Residential or Commercial",
    }),
  address: z.string(),
  zipCode: z.string().min(4),
  selectProducts: z
    .array(z.string())
    .nonempty({ message: "Select at least one product" }),
  message: z.string(),
  consentValidity: z.boolean().refine((data) => data === true, {
    message: "This field is required.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      propertyType: {
        isResidential: false,
        isCommercial: false,
      },
      address: "",
      zipCode: "",
      selectProducts: [],
      message: "",
      consentValidity: true,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = form;

  const onSubmit = (data: FormData) => {
    // Convert boolean values to strings ("Yes" or "No")
    const formattedData = {
      formName: "Contact Form",
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      propertyType: {
        isResidential: data.propertyType.isResidential ? "Yes" : "No",
        isCommercial: data.propertyType.isCommercial ? "Yes" : "No",
      },
      address: data.address,
      zipCode: data.zipCode,
      consentValidity: data.consentValidity ? "Yes" : "No",
      selectProducts: data.selectProducts.join(", "), // Convert array to string
      message: data.message,
    };

    toast({ description: "Sending your message..." });

    emailjs
      .send(
        "service_fbudjkn",
        "template_gsefjdr",
        formattedData,
        "Ut9VhVJ4vbcyqTs6e"
      )
      .then(
        (result) => {
          toast({
            description: "Your message has been sent.",
          });
          reset();
        },
        (error) => {
          toast({
            description: "Uh oh! Something went wrong, try again.",
          });
        }
      );
  };

  return (
    <div className="max-w-xl mx-auto p-8 shadow-lg rounded-lg bg-white">
      <h2 className="text-3xl font-heading font-bold mb-4 text-center">
        Contact Us
      </h2>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Name Field */}
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Email Field */}
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Field */}
            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold font-heading">Select Property Type</h6>
            <div className="flex items-center justify-start gap-5">
              <FormField
                control={control}
                name="propertyType.isResidential"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <div className="flex items-center space-x-1 leading-none">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Residential</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="propertyType.isCommercial"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <div className="flex items-center space-x-1 leading-none">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Commercial</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Address Field */}
          <div className="flex items-center justify-between gap-4">
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Select Products */}
          <h6 className="font-semibold font-heading">Select Products: </h6>
          {AllProducts.map((product) => (
            <FormField
              key={product.slug}
              control={control}
              name="selectProducts"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-1 leading-none">
                    <FormControl>
                      <Checkbox
                        checked={field.value.includes(product.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, product.name]); // Add product to array
                          } else {
                            field.onChange(
                              field.value.filter(
                                (item: string) => item !== product.name
                              )
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel>{product.name}</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={control}
            name="message"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consent */}
          <FormField
            control={control}
            name="consentValidity"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-1 leading-none">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    Yes, I read the{" "}
                    <Link
                      href={"/consent-policies"}
                      className="underline text-primary-green"
                    >
                      consent form policies
                    </Link>{" "}
                    and acknowledge to CureGreen contacting me to provide
                    information about products offered under VEU program.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-bold w-full mt-4 px-4 py-3 text-white bg-primary-navy rounded hover:bg-secondary-darkBlue hover:scale-90 transition-transform"
          >
            {isSubmitting ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : isSubmitSuccessful ? (
              "Submitted"
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
