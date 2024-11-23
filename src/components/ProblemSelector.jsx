import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";

const problems = [
    "1. Bogdan",
    "2. Christine",
    "3. George",
    "4. Hisoka",
    "5. Janice",
    "6. Krishna",
    "7. Liza",
    "8. Miguel",
    "9. Patrick",
    "10. Shreya",
    "11. Sunil",
    "12. Vanessa",
];

const ACTIVE_COLOR = "blue.400";
const ProblemSelector = ({ problem, onSelect }) => {
    return (
        <Box>
            <Text mb={2} fontSize="lg">
                Select Problem:
            </Text>
            <Menu isLazy>
                <MenuButton as={Button}>{problem}</MenuButton>
                <MenuList bg="#110c1b">
                    {problems.map((prob) => (
                        <MenuItem
                            key={prob}
                            color={prob === problem ? ACTIVE_COLOR : ""}
                            bg={prob === problem ? "gray.900" : "transparent"}
                            _hover={{
                                color: ACTIVE_COLOR,
                                bg: "gray.900",
                            }}
                            onClick={() => onSelect(prob)}
                        >
                            {prob}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Box>
    );
};

export default ProblemSelector;