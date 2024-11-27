'use client';

import { loginUser } from '@/types/user.type';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { createEmployee } from '@/lib/actions/employee/create';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/button';

const schema = z.object({
  phoneNo: z
    .string({
      required_error: 'Required',
    })
    .regex(/^\d+$/, { message: 'Invalid Phone Number' }),
  // .length(10, { message: "Invalid Phone Number" })
  // .refine((value) => /[6789]/.test(value[0]), { message: "Invalid Phone Number" }),

  password: z.string().trim().min(1, 'Required'),
});

type FormFields = z.infer<typeof schema>;

const LoginForm: React.FC<{}> = () => {
  const form = useForm<FormFields>({
    defaultValues: {
      password: '',
      phoneNo: '',
    },
    resolver: zodResolver(schema),
  });

  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      redirect(`/${session?.data?.user?.access.toLowerCase()}/profile`);
    }
  }, [session]);

  const onSubmit: SubmitHandler<FormFields> = async (data: FormFields) => {
    try {
      console.warn(data);
      localStorage.setItem('phone', data.phoneNo);
      const res = await signIn(
        'credentials',
        {
          phoneNo: data.phoneNo,
          password: data.password,
          redirect: false,
          // callbackUrl: '/admin/employees'//This was a good option . the only problem was that its shwoign invalid credentials
        }
        // { callbackUrl: '/admin/employees' }
      );
      console.log('wowoowowoowowowow', res);
      console.log(data);
      if (res?.ok) {
        form.reset({
          password: '',
          phoneNo: '',
        });
        toast.success('Logged in.');
      }
      if (!res?.ok) {
        return toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className=' top-20 flex justify-center items-center '>
      <div className='flex flex-col justify-center items-center px-4 py-4 mx-auto  '>
        <div className='w-full bg-slate-300 rounded-lg shadow mt-6 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8 border-2 border-black rounded-sm'>
            <div className='flex flex-col justify-center items-center gap-1'>
              <Image
                src={'/assets/logo.png'}
                width={50}
                height={50}
                alt='sign image'
              />{' '}
              <h1 className=' text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl font-mono'>
                Shekhar Enterprises
              </h1>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 md:space-y-6 '
              >
                {/* <h2 className=' bg-primary-color-extreme/10 text-center py-1 text-base   relative   '>
  Shekhar Enterprises
</h2> */}
                {/* <div className='flex flex-col'>  */}

                <FormField
                  control={form.control}
                  name='phoneNo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        {field.value ? (
                          <Input
                            placeholder=''
                            {...field}
                            className=' bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            type='number'
                          />
                        ) : (
                          <Input
                            placeholder='Enter phone no.'
                            {...field}
                            className=' bg-white '
                          />
                        )}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        {field.value ? (
                          <Input
                            placeholder=''
                            {...field}
                            className=' bg-white '
                            type='password'
                          />
                        ) : (
                          <Input
                            placeholder='Enter your password'
                            {...field}
                            className=' bg-white '
                          />
                        )}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* </div> */}
                <div className='flex items-center justify-center py-4 '>
                  <Button
                    type='submit'
                    className=' bg-green-500 w-full rounded-md '
                  >
                    {' '}
                    {form.formState.isSubmitting && (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    )}
                    <>Sign In</>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
