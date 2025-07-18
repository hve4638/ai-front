
type FormFieldProps<TType extends PromptVar, TValue=any> = {
    /**
     * 미지정 시 promptVar.display_name으로 대체
     * 
     * 배열 폼에서 index로 표시하기 위해 사용됨
    */
    name ?: string;
    promptVar : TType;
    value: TValue;
    onChange: (value: TValue) => void;
}

export default FormFieldProps;