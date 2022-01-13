import React, {useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "react-icons/bs";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "react-icons/go";
import ConsoleView from "../elements/misc/ConsoleView";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {VscJson} from "react-icons/vsc";
import "../elements/forms/JsonForm"
import {VscTools} from "react-icons/vsc";
import {NodeInitForm, NodeInitJsonForm, NodeRuntimeConfigForm} from "../elements/forms/NodeInitForm";
import {TracardiProPluginForm} from "../elements/forms/TracardiProPluginForm";
import {BsStar} from "react-icons/bs";
import {VscRunErrors} from "react-icons/vsc";

export function NodeDetails({node, onConfig, onRuntimeConfig, onLabelSet}) {

    const [tab, setTab] = useState(3);

    useEffect(() => {

            if (tab === 1 && !node?.data?.spec?.manual) {
                setTab(0)
            }

            if (tab === 5 && node?.data?.metadata?.pro !== true) {
                setTab(3)
            }

            if (tab === 3 && !node?.data?.spec?.form) {
                if(node?.data?.metadata?.pro === true) {
                    setTab(5)
                } else {
                    setTab(2)
                }
            }

            if (tab === 2 && !node?.data?.spec?.init) {
                setTab(0)
            }

        },
        [node, tab])

    const handleInitSubmit = (init) => {
        if(onConfig){
            onConfig(init)
        }
    }

    return (
        <div className="NodeDetails">
            <div className="Title">
                <FilterTextField label={null}
                                 initValue={node?.data?.metadata?.name}
                                 onSubmit={onLabelSet}
                                 onChange={(event) => onLabelSet(event.target.value)}/>
                <span>
                    <IconButton label="Info" onClick={() => setTab(0)} selected={tab === 0} size="large">
                            <BsInfoCircle size={22}/>
                    </IconButton>
                    {node?.data?.metadata?.pro === true && <IconButton
                        label="Tracardi Pro Editor"
                        onClick={() => setTab(5)}
                        selected={tab === 5}
                        size="large">
                        <BsStar size={22}/>
                    </IconButton>}
                    {node?.data?.spec?.form && <IconButton
                        label="Config Editor"
                        onClick={() => setTab(3)}
                        selected={tab === 3}
                        size="large">
                        <GoSettings size={22}/>
                    </IconButton>}
                    {node?.data?.metadata && <IconButton
                        label="Advanced Runtime Editor"
                        onClick={() => setTab(6)}
                        selected={tab === 6}
                        size="large">
                        <VscRunErrors size={22}/>
                    </IconButton>}
                    {node?.data?.spec?.init && <IconButton
                        label="Json Config"
                        onClick={() => setTab(2)}
                        selected={tab === 2}
                        size="large">
                        <VscTools size={22}/>
                    </IconButton>}
                    <IconButton label="Raw" onClick={() => setTab(4)} selected={tab === 4} size="large">
                            <VscJson size={22}/>
                    </IconButton>
                    </span>
            </div>
            <div className="Pane">
                {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}
                {tab === 2 && node?.data?.spec?.init &&
                <NodeInitJsonForm
                    pluginId={node?.data?.spec?.id}
                    formSchema={node?.data?.spec?.form}
                    init={node?.data?.spec?.init}
                    manual={node?.data?.spec?.manual}
                    onSubmit={handleInitSubmit}
                />}
                {tab === 3 && node?.data?.spec?.form &&
                <NodeInitForm
                    pluginId={node?.data?.spec?.id}
                    init={node?.data?.spec?.init}
                    formSchema={node?.data?.spec?.form}
                    onSubmit={handleInitSubmit}
                />}

                {tab === 4 && <ConsoleView label="Action raw data" data={node}/>}

                {node?.data?.metadata?.pro === true && tab === 5 && <TracardiProPluginForm
                    init={node?.data?.spec?.init}
                    onSubmit={handleInitSubmit}
                />
                }

                {tab === 6 && node?.data?.spec && <NodeRuntimeConfigForm
                    pluginId={node?.data?.spec?.id}
                    value={
                        {
                            skip: node?.data?.spec?.skip || false,
                            block_flow: node?.data?.spec?.block_flow || false,
                            on_connection_error_repeat: node?.data?.spec?.on_connection_error_repeat || "0",
                            run_in_background: node?.data?.spec?.run_in_background || false,
                            on_connection_continue: node?.data?.spec?.on_connection_continue || false,
                            join_input_payload: node?.data?.spec?.join_input_payload || false,
                            append_input_payload: node?.data?.spec?.append_input_payload || false,
                        }
                    }
                    onChange={onRuntimeConfig}
                />}

            </div>
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    return prevProps.node.id===nextProps.node.id;
}
export const MemoNodeDetails = React.memo(NodeDetails, areEqual);

