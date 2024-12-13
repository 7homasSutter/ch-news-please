import {Filter as FilterIcon} from 'tabler-icons-react';
import {useDisclosure} from '@mantine/hooks';
import {Button, Chip, Modal, NumberInput, Pill, PillsInput} from '@mantine/core';
import {isInRange, useForm} from "@mantine/form";
import {FilterData} from "../types";
import {useEffect} from "react";

interface Props {
    onFilterChanged: (data: FilterData) => void
    defaultFilter: FilterData,
    newspapers: string[]
}

function Filter({onFilterChanged, defaultFilter, newspapers}: Props) {

    const [opened, {open, close}] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {...defaultFilter},
        validate: {
            maxAge: isInRange({min: 1, max: 100_000}, "Please enter a value between 1 and 100'000"),
            limit: isInRange({min: 1, max: 5000}, "Please enter a value between 1 and 5000")
        }
    })

    useEffect(() => {
        if (defaultFilter) {
            console.log(defaultFilter)
            form.setValues(defaultFilter)
        }
    }, [defaultFilter]);


    const changed = (values: FilterData) => {
        close()
        onFilterChanged(values)
    }

    const removeKeyword = (keyword: string) => {
        const pills = form.getValues().keywords.filter((k: string) => k !== keyword)
        form.setFieldValue("keywords", pills)
    }

    const addKeyword = (event) => {
        const value = event.target.value
        if (!value) {
            return
        }
        const pills = [...form.getValues().keywords]
        if (!pills.includes(value)) {
            pills.push(value)
            form.setFieldValue("keywords", pills)
        }
        event.target.value = ""
    }

    // @ts-ignore
    return (
        <>
            <Modal title="Filter options" className="filterSettings" opened={opened} onClose={close}>
                <form onSubmit={form.onSubmit(changed)}>
                    <NumberInput
                        label="Max age in days"
                        key={form.key("maxAge")}
                        {...form.getInputProps('maxAge')}
                    />
                    <NumberInput
                        label="Max number articles"
                        key={form.key("limit")}
                        {...form.getInputProps('limit')}
                    />
                    <PillsInput label={"Keywords"} style={{marginBottom: 10}}>
                        <Pill.Group>
                            {form.getValues().keywords.map((keyword: string) => (<Pill
                                key={keyword}
                                withRemoveButton
                                onRemove={() => {
                                    removeKeyword(keyword)
                                }}
                            >{keyword}
                            </Pill>))}
                            <PillsInput.Field
                                placeholder="Enter keyword"
                                onBlur={addKeyword}
                            />
                        </Pill.Group>
                    </PillsInput>
                    <Chip.Group
                        multiple
                        defaultValue={form.getValues().newspapers}
                        onChange={(value: string[]) => form.setFieldValue("newspapers", value)}
                    >
                        <div style={{
                            marginTop: 10,
                            marginBottom: 10,
                            display: 'flex',
                            flexDirection: "row",
                            flexWrap: 'wrap',
                            gap: '5px'
                        }}>
                            {newspapers.map((newspaper: string) => <Chip
                                key={newspaper}
                                value={newspaper}
                            >{newspaper}</Chip>)}
                        </div>
                    </Chip.Group>
                    <Button type="submit"> Change filter</Button>
                </form>

            </Modal>
            {!opened && <div className="topOverlayFilterPanel hoverable" onClick={open}>
                <FilterIcon/>
            </div>}
        </>
    )
}

export default Filter
