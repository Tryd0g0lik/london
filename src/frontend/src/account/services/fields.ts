// import React from 'react';
import { FieldInnerHtml } from '@Interfaces';

/**
 * Тут, больше вопрос безопасности.
 * @returns HTMLLableElement
 */
export function basisRedactField(props: FieldInnerHtml): HTMLElement {
  const { dataNamex, text = '' } = props;
  const label = document.createElement('label');
  const input = document.createElement('input');


  label.htmlFor = "text";
  label.className = "input input-bordered flex items-center gap-2";
  input.setAttribute('data-namex', dataNamex);

  /* Node!! This is attribute 'data-current'. It if we can see   `inpute[data-current='create']`, then \
  this input-form  for process only added new line in db. If \
  we ca see `inpute[data-current='redaction']`, then this is form only a redacting/ide content. */
  input.setAttribute('data-current', 'create');
  // input.id = dataNamex;
  input.name = 'text';
  input.type = 'text';
  input.maxLength = 50;
  input.className = "grow";
  input.placeholder = "text";
  if (text.length > 0) {
    input.placeholder = text
  };
  label.appendChild(input)

  return label
}

export function CorrectorBasisRedactField(fun: (props: FieldInnerHtml) => HTMLElement, prop: FieldInnerHtml): HTMLElement {
  const {
    dataNamex = 'ads',
    text = 'Доброе дело',
    types = 'text',
    classNames = "input input-bordered flex items-center gap-2"
  } = prop;
  const lebalHtml = fun({ dataNamex, text });
  lebalHtml.className = classNames;
  const inputHtml = lebalHtml.querySelector('input');
  if (inputHtml === null) {
    throw new Error('[service -> field]: Something whtat wrong! "input" ')
  }
  inputHtml.type = types;
  lebalHtml.innerHTML = inputHtml.outerHTML;
  return lebalHtml;
}

