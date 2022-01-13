import React, {useState, useEffect, useCallback, useRef} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {ObjectRow} from "./rows/ObjectRow";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";

const AutoLoadObjectList = ({
                                label,
                                timeField,
                                timeFieldLabel,
                                timeFieldWidth,
                                filterFields,
                                onLoadDetails,
                                onDetails,
                                onLoadRequest,
                                refreshInterval = 0
                            }) => {

    const [page, setPage] = useState(0)
    const [hasMore, setHasMode] = useState(false)
    const [total, setTotal] = useState(0)
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [allowLoadingSpinner, setAllowLoadingSpinner] = useState(true);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const loadData = useCallback((fresh=false, progress=false) => {
        if (mounted.current===true && progress) {
            setLoading(true);
        }
        const endpoint = {...onLoadRequest, url: `${onLoadRequest.url}/page/${page}`};
        request(
            endpoint,
            (state) => {
                if (mounted.current===true && progress) {
                    setLoading(state)
                }
            },
            (e) => {
                if (mounted.current===true) {
                    setError(e)
                }
            },
            (response) => {
                if (response) {
                    if (mounted.current===true) {
                        setHasMode(response.data.result.length !== 0);
                        setTotal(response.data.total);
                        setRows((page === 0 || fresh === true) ? [...response.data.result] : [...rows, ...response.data.result]);

                    }
                }
            }
        );
    }, [page]);

    useEffect(() => {
        let timer;
        if (refreshInterval > 0) {
            setPage(0);
            timer = setInterval(() => {loadData(true, false)}, refreshInterval * 1000);
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [refreshInterval, loadData]);

    useEffect(() => {
        loadData(false, allowLoadingSpinner);
        setAllowLoadingSpinner(false);
    }, [loadData]);

    const widthStyle =
        typeof timeFieldWidth !== "undefined"
            ? timeFieldWidth > 0
            ? {minWidth: timeFieldWidth, maxWidth: timeFieldWidth}
            : false
            : {};

    const renderHeader = (timeFieldLabel) => {
        const rowCountText = `Showing ${rows.length} of ${total} total records`;

        return (
            <div className="Header">
                {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
                <div className="Data">
                    {label} - {rowCountText}
                </div>
            </div>
        );
    };

    const renderRows = (rows) => {
        if (Array.isArray(rows)) {
            return rows.map((row, index) => {
                return (
                    <ObjectRow
                        key={index}
                        row={row}
                        timeField={timeField}
                        timeFieldWidth={timeFieldWidth}
                        filterFields={filterFields}
                        onClick={() => {
                            onDetails(row.id);
                        }}
                        displayDetailButton={typeof onLoadDetails !== "undefined"}
                    />
                );
            });
        }
    };

    if (loading) {
        return <CenteredCircularProgress/>;
    }

    if (error) {
        return <ErrorsBox errorList={error}/>;
    }

    return (
        <div className="ObjectList">
            {renderHeader(timeFieldLabel)}
            <InfiniteScroll
                dataLength={rows.length}
                next={() => {
                    setPage(page + 1)
                }}
                inverse={false}
                hasMore={hasMore && refreshInterval===0}
                style={{overflow: "hidden"}}
                loader={<div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: 4}}>
                    <CircularProgress size={20}/></div>}
                scrollableTarget="MainWindowScroll"
            >
                {renderRows(rows)}
            </InfiniteScroll>
        </div>
    );
};

export default AutoLoadObjectList;
