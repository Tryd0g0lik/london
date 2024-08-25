import React, { KeyboardEvent } from 'react'; // { useState, SetStateAction }
import { add } from '@Services/fetches';
import { getCookie, checkCookieExists } from '@Services/coockieSessionId';
import { messageForUser } from '@Services/messengerForm';
import { createDivLableContainer } from '@Services/fields';

import { OneLine, Ads } from '@Interfaces';

export async function handlerLoadingProfils(): Promise<boolean> {

  return true;
}
