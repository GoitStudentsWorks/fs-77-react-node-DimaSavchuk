import { FieldArray, Field, useField, getIn, ErrorMessage } from 'formik';
import {
  CloseButton,
  FieldCounter,
  FieldMeasure,
  FieldsWrapper,
  IngridientsWrapper,
  TitleWrapper,
  // ErrorText,
} from './IngredientsBlock.styled';
import { TfiClose, TfiPlus, TfiMinus } from 'react-icons/tfi';
import IngredientsMenu from '../IngredientsMenu';
import { ErrorText } from '../RecipePreparation/RecipePreparation.styled';

const IngredientsBlock = ({ items, title }) => {
  const initialValue = { title: '', measure: '' };

  const [field, meta, helpers] = useField('ingredients');
  // console.log(field);

  return (
    <FieldArray
      name="ingredients"
      render={({
        form: {
          values: { ingredients },
        },
        push,
        remove,
      }) => {
        // console.log('touched', meta.touched);
        // console.log(`error`, meta.error);

        return (
          <IngridientsWrapper>
            <TitleWrapper>
              <h3>Ingredients</h3>
              <FieldCounter>
                <button type="button" onClick={() => remove()}>
                  <TfiMinus size={16} />
                </button>
                <span>{ingredients.length ? ingredients.length : '0'}</span>
                <button type="button" onClick={() => push(initialValue)}>
                  <TfiPlus size={16} />
                </button>
              </FieldCounter>
            </TitleWrapper>
            <div>
              {ingredients.length > 0 &&
                ingredients.map((ingredient, index) => {
                  return (
                    <FieldsWrapper
                      key={index}
                      role="ingredientsSelect"
                      aria-labelledby="ingridientsSelect-group"
                    >
                      <IngredientsMenu
                        items={items}
                        title={title}
                        ingredient={ingredient}
                        index={index}
                      />

                      <div style={{ position: 'relative' }}>
                        <FieldMeasure
                          name={`ingredients.${index}.measure`}
                          placeholder={'1 cl'}
                          index={index}
                        />
                      </div>

                      <CloseButton type="button" onClick={() => remove(index)}>
                        <TfiClose size={18} />
                      </CloseButton>
                    </FieldsWrapper>
                  );
                })}
              {/* {ingredients.length > 0 &&
              errors &&
              typeof errors.ingredients === 'string' ? (
                <ErrorText>{errors.ingredients.title}</ErrorText>
              ) : null} */}
              {meta.touched && meta.error && typeof meta.error === 'string' && (
                <ErrorText>{meta.error}</ErrorText>
              )}
            </div>
          </IngridientsWrapper>
        );
      }}
    ></FieldArray>
  );
};

export default IngredientsBlock;