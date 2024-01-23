import React, {useCallback, useState} from "react";
import "../elements/lists/CardBrowser.css";
import CardBrowser from "../elements/lists/CardBrowser";
import {IoArrowRedoOutline} from "react-icons/io5";
import BrowserRow from "../elements/lists/rows/BrowserRow";
import EventRedirectForm from "../elements/forms/EventRedirectForm";
import {useConfirm} from "material-ui-confirm";
import EventRedirectDetails from "../elements/details/EventRedirectDetails";
import {useRequest} from "../../remote_api/requestClient";

export default function EventRedirect() {

    const [refresh, setRefresh] = useState(0);

    const urlFunc= useCallback((query) => ('/event-redirect/list'+ ((query) ? "?query=" + query : "")),[]);
    const addFunc = useCallback((close) => <EventRedirectForm
        onSaveComplete={close}/>,[]);
    const detailsFunc= useCallback((id, close) => <EventRedirectDetails
        id={id}
        onDeleteComplete={close}
        onEditComplete={close}/>, [])
    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this event redirect?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/event-redirect/' + id,
                            method: "delete"
                        })
                        setRefresh(refresh+1)
                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const rows = (data, onClick) => {
        return data?.grouped && Object.entries(data?.grouped).map(([category, plugs], index) => {
            return <div className="RowGroup" style={{width:"100%"}} key={index}>
                <header>{category}</header>
                <div>
                    {plugs.map((row, subIndex) => {
                        return <BrowserRow key={index + "-" + subIndex}
                                           id={row?.id}
                                           data={{...row, icon: "redirect"}}
                                           tags={row.tags}
                                           onClick={() => onClick(row?.id)}
                                           onDelete={handleDelete}
                                            deplomentTable='event_redirect'
                        />
                    })}
                </div>
            </div>
        })
    }

    return <CardBrowser
        defaultLayout="rows"
        label="Event redirects"
        description="List of event redirects."
        urlFunc={urlFunc}
        rowFunc={rows}
        buttonLabel="New event redirect"
        buttonIcon={<IoArrowRedoOutline size={20}/>}
        drawerDetailsWidth={700}
        detailsFunc={detailsFunc}
        drawerAddTitle="New event redirect"
        drawerAddWidth={600}
        addFunc={addFunc}
    />
}
