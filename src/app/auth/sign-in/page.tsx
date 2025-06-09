import { getCurrentSession, loginUser } from '@/actions/auth'
import SignIn from '@/components/auth/SignIn';
import { redirect } from 'next/navigation';
import { SignUpSchema } from '@/schema/authSchema';
import React from 'react'

const SignUpPage = async () => {
  const {user} = await getCurrentSession();

  if(user){
    return redirect('/')
  }

  const action = async (state: { message: string } | undefined, formData: FormData)=>{
    'use server'
    const parsed = SignUpSchema.safeParse(Object.fromEntries(formData))
    if(!parsed.success){
        return { message : 'Invalid form data'}
    }
    const {email, password} = parsed.data;
    const {user, error} = await loginUser(email, password);
    if(error){
        return {message : error}
    } else if (user){
        return redirect('/');
    }
  }

  return (
    <SignIn action={action}/>
  )
}

export default SignUpPage