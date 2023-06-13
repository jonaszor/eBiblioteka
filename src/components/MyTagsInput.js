import { ReactTags } from "react-tag-autocomplete";
import { Controller } from "react-hook-form";
import { Row } from "react-bootstrap";

function MyTagsInput({name, control, suggestions, placeholder, className, error}){
    return (
        <Row className={className}>
            <Controller
                name={name}
                control={control}
                defaultValue={[]}
                className={'form-control'}
                render={({field}) =>(
                    <ReactTags {...field}
                        selected = {field.value}
                        onAdd={(tag) => {field.onChange([...field.value, tag])}}
                        onDelete={(tagIndex) => {field.onChange(field.value.filter((_,i) => (i !== tagIndex)))}}
                        suggestions={suggestions}
                        placeholderText={placeholder}
                    />
                )}
            />  
            <div className="invalid-feedback">{error?.message}</div>
        </Row>
    )
}

export default MyTagsInput;