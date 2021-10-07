import React, {useCallback, useEffect} from "react";
import TextField from "@material-ui/core/TextField";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import "./JsonForm.css";
import MenuItem from "@material-ui/core/MenuItem";


const label2Component = (label, id, value, onChange) => {

    switch (label) {
        case "resources":
            return (props) => <ResourceSelect id={id} value={value} onChange={onChange}/>
        case "dotPath":
            return (props) => <DotPathInput id={id} value={value} onChange={onChange} {...props}/>
        case "text":
            return (props) => <TextInput id={id} value={value} onChange={onChange} {...props}/>
        case "number":
            return (props) => <NumberInput id={id} value={value} onChange={onChange} {...props}/>
        case "textarea":
            return (props) => <TextAreaInput id={id} value={value} onChange={onChange} {...props}/>
        default:
            return (props) => ""
    }
}

function DotPathInput({id, onChange, label, value, error}) {

    let [sourceValue, pathValue] = value ? value.split('@') : ["", ""]
    if(typeof pathValue === 'undefined' && sourceValue) {
        pathValue = sourceValue
        sourceValue = ''
    }

    const [path, setPath] = React.useState(pathValue || "");
    const [source, setSource] = React.useState(sourceValue || "");

    const sources = [
        {
            value: '',
            label: '',
        },
        {
            value: 'payload',
            label: 'payload',
        },
        {
            value: 'profile',
            label: 'profile',
        },
        {
            value: 'event',
            label: 'event',
        },
        {
            value: 'session',
            label: 'session',
        },
        {
            value: 'flow',
            label: 'flow',
        },
    ];

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleExternalOnChange = (path, source) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, source+"@"+path);
        }
    }

    const handlePathChange = (event) => {
        setPath(event.target.value);
        handleExternalOnChange(event.target.value, source);
    };

    const handleSourceChange = (event) => {
        setSource(event.target.value);
        handleExternalOnChange(path, event.target.value);
    };

    return <div style={{display: "flex"}}>
        <TextField select
                   label="Source"
                   variant="outlined"
                   size="small"
                   value={source}
                   onChange={handleSourceChange}
                   style={{width: 100, marginRight: 5}}
        >
            {sources.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
        <TextField id={id}
                   label={label}
                   value={path}
                   onChange={handlePathChange}
                   error={error}
                   variant="outlined"
                   size="small"
        />
    </div>
}

function TextInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, event.target.value);
            event.preventDefault();
        }
        setInputValue(event.target.value);
    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      size="small"
                      fullWidth
    />
}

function NumberInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        try {
            let value = ""
            if(event.target.value) {
                value = parseInt(event.target.value)
            }
            if(!isNaN(value)) {
                if (typeof (onChange) != "undefined") {
                    onChange(id, value);
                }
                setInputValue(value);
            }

        } catch (e) {
            console.log(e)
        }


    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      size="small"
                      inputProps={{inputMode: "numeric", pattern: '[0-9]*'}}
                      fullWidth
    />
}

function TextAreaInput({id, onChange, label, value, error}) {

    const [inputValue, setInputValue] = React.useState(value || "");

    const cachedOnChange = useCallback((id, value) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, value);
        }
    }, [onChange])

    useEffect(() => {
        cachedOnChange(id, value);
    }, [id, value, cachedOnChange])

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            onChange(id, event.target.value);
            event.preventDefault();
        }
        setInputValue(event.target.value);
    };

    return <TextField id={id}
                      label={label}
                      value={inputValue}
                      onChange={handleChange}
                      error={error}
                      variant="outlined"
                      multiline
                      fullWidth
                      rows={4}
    />
}

const ResourceSelect = ({id, onChange, value, disabled = false, placeholder = "Resource"}) => {

    const handleChange = (event) => {
        if (typeof (onChange) != "undefined") {
            if (event !== null) {
                onChange(id, event.id);
            }
        }
    };

    return <AutoComplete disabled={disabled}
                         solo={false}
                         placeholder={placeholder}
                         url="/resources"
                         initValue={{"id": "", "name": ""}}
                         onSetValue={handleChange}
                         onDataLoaded={
                             (result) => {
                                 if (result) {
                                     let sources = []
                                     for (const source of result?.data?.result) {
                                         if (typeof source.name !== "undefined" && typeof source.id !== "undefined") {
                                             sources.push({name: source.name, id: source.id})
                                         }
                                     }
                                     return sources
                                 }
                             }
                         }/>

}

export default function JsonForm({schema, values = {}, onSubmit}) {

    let formValues = {}

    // const objMap = (obj, func) => {
    //     return Object.entries(obj).map(([k, v]) => func(k, v));
    // }

    const onChange = (id, value) => {
        formValues[id] = value
    }

    const Title = ({title}) => {
        if (typeof title != 'undefined') {
            return <h1>{title}</h1>
        }
        return ""
    }

    const Name = ({text, isFirst = false}) => {
        if (typeof text != 'undefined') {
            if (isFirst === true) {
                return <h3 style={{marginTop: 0}}>{text}</h3>
            }
            return <h3>{text}</h3>
        }
        return ""
    }

    const Description = ({text}) => {
        if (typeof text != 'undefined') {
            return <p>{text}</p>
        }
        return ""
    }

    const Fields = ({fields, values}) => {

        return fields.map((fieldObject, key) => {
            const fieldName = fieldObject.id
            const component = fieldObject.component?.type
            const props = fieldObject.component?.props
            if (typeof component != "undefined") {
                const componentCallable = label2Component(component,
                    fieldName,
                    fieldName in values ? values[fieldName] : "",
                    onChange)
                return <div key={fieldName + key}>
                    <Name text={fieldObject.name} isFirst={key === 0}/>
                    <Description text={fieldObject.description}/>
                    {componentCallable(props)}
                </div>
            } else {
                return ""
            }
        })
    }

    const Groups = ({groups}) => {

        return groups.map((groupObject, idx) => {
            return <section key={idx}>
                {groupObject.name && <h2>{groupObject.name}</h2>}
                {groupObject.description && <Description text={groupObject.description}/>}
                {groupObject.fields && <Fields fields={groupObject.fields} values={values}/>}
            </section>
        })
    }

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formValues)
        }
    }

    if (schema) {
        return <form className="JsonForm">
            {schema.title && <Title title={schema.title}/>}
            {schema.groups && <Groups groups={schema.groups}/>}
            <Button onClick={handleSubmit} label="Submit"/>
        </form>
    }

    return ""

}