import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tag,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const FormAutoComplete = ({
  id,
  options = [],
  label,
  selected,
  left,
  right,
  rightProps,
  leftProps,
  help,
  renderItem,
  renderKey,
  control,
  tag,
  onSelect,
  errormsg,
  clearValue,
  ...rest
}) => {
  const inputRef = useRef();
  const [search, setSearch] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (e) => {
    setSearch(e.target.value);
    onOpen();
  };

  const results = useMemo(
    () => options.filter((o) => JSON.stringify(o.name).search(new RegExp(search, "ig")) > -1),
    [search]
  );

  const handleSelect = (item) => {
    setSearch(renderItem(item));
    onSelect && onSelect({ ...item, formId: id });
  };

  useEffect(() => {
    setSearch("");
  }, [clearValue]);

  return (
    <Popover id placement="bottom-start" closeOnBlur closeOnEsc isOpen={isOpen} initialFocusRef={inputRef}>
      <PopoverTrigger>
        <FormControl {...control}>
          <FormLabel>
            {label} {tag && <Tag size="sm">{tag}</Tag>}
          </FormLabel>
          <InputGroup>
            {left && <InputLeftElement {...leftProps}>{left}</InputLeftElement>}
            <Input ref={inputRef} onBlur={onClose} value={search} onChange={handleChange} {...rest} />
            {right && (
              <InputRightElement width="4.5rem" {...rightProps}>
                {right}
              </InputRightElement>
            )}
          </InputGroup>
          {help && <FormHelperText>{help}</FormHelperText>}
          {control.isInvalid && <FormErrorMessage>{errormsg}</FormErrorMessage>}
        </FormControl>
      </PopoverTrigger>

      <PopoverContent
        // bg={useColorModeValue("gray.100", "#252525")}
        borderWidth={0}
        _focus={{ borderWidth: 0 }}
        _hover={{ borderWidth: 0 }}
      >
        <PopoverBody>
          {Array.isArray(results) &&
            results.slice(0, 10).map((r) => (
              <Button
                variant="ghost"
                mr={2}
                onClick={() => handleSelect(r)}
                key={renderKey(r)}
                width="full"
                sx={{ textAlign: "start" }}
              >
                {renderItem(r)}
              </Button>
            ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FormAutoComplete;
