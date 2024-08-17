import React, { JSX, } from 'react';
import { PermissionPageFC } from './FormAuthorization';



export function AuthorizatorPageFC(): JSX.Element {
  console.log('-----------------------------------------------')
  return (
    <section className='form-permission'>
      <PermissionPageFC />
    </section>
  )
}

