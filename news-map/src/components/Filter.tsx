import {Filter as FilterIcon} from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';
import {Button, Chip, Modal, NumberInput } from '@mantine/core';
import {isInRange, useForm} from "@mantine/form";
interface Props {

}

function Filter({}: Props) {

    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            limit: 200,
            newspapers: ["srf.ch"],
            keywords: [],
            maxAge: 60
        },
        validate: {
            maxAge: isInRange({min: 1, max: 100_000}, "Please enter a value between 1 and 100'000"),
            limit: isInRange({min: 1, max: 5000}, "Please enter a value between 1 and 5000")
        }
    })

    const onFilterChanged = (values:  {limit: number, newspapers: string[], keywords: string[], maxAge: number}) => {
        console.log(values)
    }

    return (
        <>
            <Modal title="Filter options" className="filterSettings" opened={opened}  onClose={close}>
                <form onSubmit={form.onSubmit(onFilterChanged)}>
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
                    <Chip.Group
                        multiple
                        defaultValue={form.values.newspapers}
                        onChange={(value: string[]) => form.setFieldValue("newspapers", value)}
                    >
                        <Chip value="20min.ch">20min</Chip>
                        <Chip value="srf.ch">SRF News</Chip>

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
