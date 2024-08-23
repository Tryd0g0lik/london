import React, { useEffect, useState } from 'react';
// import parse from 'html-react-parser';
import { NavFC } from '@Components/NavOpPages';
import { CorrectorBasisRedactField, basisRedactField } from '@Services/fields';
import { handlerAdsFC, loaderContents } from './handlers/handlerAds';
// const line = 0;
/* --------------- Here is we working under an ADS ------------------ */
export function ProfileAdsFC(): React.JSX.Element {
  // const [labelHtml, setLabelHtml] = useState<Array<{ __html: string | React.JSX.Element }> | null>(null);
  const p = document.createElement('p');
  const [labelHtml, setLabelHtml] = useState<HTMLElement>(p);

  useEffect(() => {

    /* ---- This is a row/line ---- */
    const newLabelHtml = CorrectorBasisRedactField(basisRedactField, { dataNamex: 'ads', text: 'Напиши свое доброе дело' });
    setLabelHtml(newLabelHtml);
    // handlerClickOfButton(newLabelHtml as HTMLLabelElement);
    loaderContents(newLabelHtml as HTMLLabelElement);

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
