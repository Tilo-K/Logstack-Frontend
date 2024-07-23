"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FilterOptions, Log, Project } from "@/types";
import React, { use, useEffect, useRef } from "react";
import { getFilterOptions, getLogCount, getLogs } from "./logs";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function LogTable(props: { project: Project }) {
    const [logs, setLogs] = React.useState<Log[]>([]);
    const [content, setContent] = React.useState<string | undefined>();
    const [logLevel, setLogLevel] = React.useState<string | undefined>();
    const [origin, setOrigin] = React.useState<string | undefined>();

    const [top, setTop] = React.useState<number>(10);
    const [skip, setSkip] = React.useState<number>(0);

    const [logLevelOpen, setlogLevelOpen] = React.useState<boolean>(false);
    const [logLevelSearchValue, setlogLevelSeachValue] =
        React.useState<string>("");

    const [logCount, setLogCount] = React.useState<number>(0);
    const [filterOptions, setFilterOptions] = React.useState<
        FilterOptions | undefined
    >();

    let lastRequest = useRef<number>(-1);
    let firstLoad = useRef<boolean>(true);

    useEffect(() => {
        getLogCount(props.project.id, props.project.secret).then((count) => {
            setLogCount(count);
        });

        getFilterOptions(props.project.id, props.project.secret).then(
            (options) => {
                options.logLevels = ["No selection", ...options.logLevels];
                options.origins = ["No selection", ...options.origins];

                setFilterOptions(options);
            }
        );
    }, [props.project]);

    useEffect(() => {
        clearTimeout(lastRequest.current);

        let id = setTimeout(
            () => {
                if(logLevel === "No selection"){
                    setLogLevel(undefined)
                }

                if(origin === "No selection"){
                    setOrigin(undefined)
                }

                getLogs(
                    props.project.id,
                    props.project.secret,
                    logLevel,
                    origin,
                    content,
                    top,
                    skip
                ).then((logs) => {
                    setLogs(logs);
                });
            },
            firstLoad.current ? 0 : 500
        );

        lastRequest.current = id as unknown as number;
        firstLoad.current = false;
    }, [logLevel, origin, content, top, skip, props.project]);

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-row gap-4">
                <Input
                    type="text"
                    placeholder="Content search..."
                    onChange={(e) => setContent(e.target.value)}
                    value={!content ? "" : content}
                />
                <Popover open={logLevelOpen} onOpenChange={setlogLevelOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={logLevelOpen}
                            className="w-[200px] justify-between"
                        >
                            {logLevelSearchValue
                                ? filterOptions?.logLevels.find(
                                      (logLvl) => logLvl === logLevelSearchValue
                                  )
                                : "LogLevel..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search LogLevels..." />
                            <CommandEmpty>No LogLevel found.</CommandEmpty>
                            <CommandList>
                                <CommandGroup>
                                    {filterOptions?.logLevels.map((logLvl) => (
                                        <CommandItem
                                            key={logLvl}
                                            value={logLvl}
                                            onSelect={(currentValue) => {
                                                setLogLevel(
                                                    currentValue ===
                                                        logLevelSearchValue
                                                        ? ""
                                                        : currentValue
                                                );

                                                setlogLevelOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    logLevelSearchValue ===
                                                        logLvl
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {logLvl}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <Select onValueChange={(e) => setTop(parseInt(e))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Results per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Table>
                {logs.length == 1 ? (
                    <TableCaption>
                        Showing {logs.length} log entry.
                    </TableCaption>
                ) : (
                    <TableCaption>
                        Showing {logs.length} of {logCount} log entries.
                    </TableCaption>
                )}
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Time</TableHead>
                        <TableHead>Log Level</TableHead>
                        <TableHead className="text-right">Content</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">
                                {new Date(log.time).toLocaleString()}
                            </TableCell>
                            <TableCell>{log.logLevel}</TableCell>
                            <TableCell className="text-right">
                                {log.content}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
