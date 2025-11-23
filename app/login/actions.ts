'use server';

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Validation } from '@/utils/validation'
import { createClient } from '@/utils/supabase/server'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const validator = new Validation()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = validator.validateAll({
    email: {
      value: email,
      rules: { required: true, email: true }
    },
    password: {
      value: password,
      rules: { required: true, minLength: 8 }
    }
  })

  if (!result.valid) {
    const errors: { [key: string]: string[] } = {}
    for (const key in result.results) {
      if (!result.results[key].valid) {
        errors[key] = result.results[key].errors
      }
    }
    return { errors }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}