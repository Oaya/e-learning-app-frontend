import Select, {
  components,
  type MultiValueGenericProps,
  type OptionProps,
} from "react-select";
import defaultAvatar from "@/assets/user.png";

type InstructorOptions = {
  value: string;
  label: string;
  avatar?: string | null;
  withAvatar?: boolean;
};

export default function CustomSelect({
  styles: propStyles,
  classNames: propClassNames,
  className: propClassName,
  withAvatar,
  ...props
}: any) {
  return (
    <Select
      className={propClassName ?? "mb-2 w-full"}
      classNamePrefix="rs"
      classNames={{
        control: (state) =>
          `!rounded !border !bg-white !text-sm !shadow-none ${
            state.isFocused ? "!border-theme-purple-50" : "!border-gray-200"
          } ${state.isDisabled ? "!bg-gray-50" : "!bg-white"}`,
        valueContainer: () => "!px-2 !py-2.5 max-sm:!px-3",
        singleValue: () => "!text-gray-900",
        ...propClassNames,
      }}
      styles={{
        singleValue: (base) => ({ ...base, color: "#111827" }),
        ...propStyles,
      }}
      components={
        withAvatar
          ? {
              Option: CustomOption,
              MultiValueLabel: CustomMultiValueLabel,
            }
          : {}
      }
      {...props}
      value={props.value === null ? undefined : props.value}
    />
  );
}

function CustomOption(props: OptionProps<InstructorOptions, true>) {
  const { label, avatar } = props.data;
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={avatar || defaultAvatar}
          alt={label}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            marginRight: 10,
            objectFit: "cover",
          }}
        />
        {label}
      </div>
    </components.Option>
  );
}

function CustomMultiValueLabel(
  props: MultiValueGenericProps<InstructorOptions>,
) {
  const { label, avatar } = props.data;
  return (
    <components.MultiValueLabel {...props}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={avatar || defaultAvatar}
          alt={label}
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            marginRight: 6,
            objectFit: "cover",
          }}
        />
        {label}
      </div>
    </components.MultiValueLabel>
  );
}
