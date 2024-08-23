import React, { useEffect, useState } from 'react';
// import parse from 'html-react-parser';
import { NavFC } from '@Components/NavOpPages';
import { CorrectorBasisRedactField, basisRedactField } from '@Services/fields';
import { handlerAdsFC, loaderContents, handlerClickOfButton } from './handlers/handlerAds';
// const line = 0;
/* --------------- Here is we working under an ADS ------------------ */
export function ProfileAdsFC(): React.JSX.Element {
  // const [labelHtml, setLabelHtml] = useState<Array<{ __html: string | React.JSX.Element }> | null>(null);
  const p = document.createElement('p');
  const [labelHtml, setLabelHtml] = useState<HTMLElement>(p);
  // const [newLabel, setNewLabel] = useState<React.ReactNode | null>(null);
  // quantity
  // const [quantity, setQuantity] = useState<number>(0);
  //  const [fields, setFields] = useState<Array<{ __html: React.JSX.Element }> | null>(null);

  // const inputs = `${newLabel}${(labelHtml as Array<{ __html: string | React.JSX.Element }>)[0].__html}`;

  // for (let i = 0; i <= Number(quantity); i++) {


  // }
  useEffect(() => {

    /* ---- This is a row/line ---- */
    const newLabelHtml = CorrectorBasisRedactField(basisRedactField, { dataNamex: 'ads', text: 'Напиши свое доброе дело' });
    setLabelHtml(newLabelHtml);
    handlerClickOfButton(newLabelHtml as HTMLLabelElement);
    loaderContents();

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
