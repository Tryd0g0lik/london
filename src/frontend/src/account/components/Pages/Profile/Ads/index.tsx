import React, { useEffect, useState } from 'react';
import { NavFC } from '@Components/NavOpPages';
import { CorrectorBasisRedactField, basisRedactField } from '@Services/fields';
import { handlerAdsFC } from './handlers/handlerAds';
import { loaderContents } from './handlers/handlerDownloadAll';
import { checkerCookieKey } from '@Services/coockieSessionId';

let ind = 0;
/* --------------- Here is we working under an ADS ------------------ */
export function ProfileAdsFC(): React.JSX.Element {
  const p = document.createElement('p');
  const [labelHtml, setLabelHtml] = useState<HTMLElement>(p);

  useEffect(() => {
    checkerCookieKey();
    /* ---- This is a row/line ---- */
    const newLabelHtml = CorrectorBasisRedactField(basisRedactField, { dataNamex: 'ads', text: 'Напиши свое доброе дело' });
    setLabelHtml(newLabelHtml);

    if (ind === 0) {
      loaderContents(newLabelHtml as HTMLLabelElement);
      ind++;
    }
    return () => {
    }
  }, []);

  return <>
    <NavFC />
    <div className='h'>
      <h3>Список добрых дел</h3>
    </div>
    <section onClick={handlerAdsFC(labelHtml as HTMLLabelElement)} data-namex='ads'>
      <div className='profile form form-ads'>
        <button type='submit' className="btn btn-outline btn-accent">Создать строчку</button>
    </div>
      <div className='profile form form-ads'>
    </div>
    </section>
    <div className='profile form list-ads'></div>

  </>
}
