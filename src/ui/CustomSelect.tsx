import Select, {
  components,
  type MultiValueGenericProps,
  type OptionProps,
} from "react-select";

type InstructorOptions = {
  value: string;
  label: string;
  avatar?: string | null;
  withAvatar?: boolean;
};

export default function CustomSelect(props: any) {
  return (
    <Select
      className="mt-1"
      classNamePrefix="rs"
      components={
        props.withAvatar
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
          src={avatar || "/src/assets/user.png"}
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
          src={avatar || "/src/assets/user.png"}
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
