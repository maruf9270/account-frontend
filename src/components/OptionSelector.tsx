import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Search } from "lucide-react";

export interface Option {
  value: string | number;
  label: string;
}

interface OptionSelectorProps {
  options: Option[];
  onChange: (value: Option["value"]) => void;
  onLoadMore: () => void;
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  value?: Option["value"];
  size?: "lg" | "sm";
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  onChange,
  onLoadMore,
  isLoading = false,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  onSearch,
  value,
  size,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find the selected option based on value
  const selectedOption = options?.find(
    (option) => option?.value?.toString() === value?.toString()
  );

  // Handle opening the dropdown
  const handleOpen = () => {
    setIsOpen(true);
    // Focus search input when dropdown opens
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  // Handle closing the dropdown
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  // Handle option selection
  const handleSelect = (option: Option) => {
    onChange(option.value);
    handleClose();
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setHighlightedIndex(0);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const newIndex = prev < options.length - 1 ? prev + 1 : prev;
          scrollToOption(newIndex);

          // Check if we're near the end of the list to trigger loading more
          if (newIndex >= options.length - 3 && !isLoading) {
            onLoadMore();
          }

          return newIndex;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => {
          const newIndex = prev > 0 ? prev - 1 : 0;
          scrollToOption(newIndex);
          return newIndex;
        });
        break;
      case "Enter":
        e.preventDefault();
        if (options[highlightedIndex]) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        handleClose();
        break;
      case "Tab":
        handleClose();
        break;
    }
  };

  // Scroll to the highlighted option
  const scrollToOption = (index: number) => {
    if (optionsRef.current && optionsRef.current.children[index]) {
      const optionElement = optionsRef.current.children[index] as HTMLElement;
      const containerHeight = optionsRef.current.clientHeight;
      const optionTop = optionElement.offsetTop;
      const optionHeight = optionElement.clientHeight;

      // Check if the option is not visible
      if (optionTop < optionsRef.current.scrollTop) {
        // Scroll up to show the option
        optionsRef.current.scrollTop = optionTop;
      } else if (
        optionTop + optionHeight >
        optionsRef.current.scrollTop + containerHeight
      ) {
        // Scroll down to show the option
        optionsRef.current.scrollTop =
          optionTop + optionHeight - containerHeight;
      }
    }
  };

  // Check if we need to load more options when scrolling
  const handleScroll = () => {
    if (optionsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = optionsRef.current;
      // If we're close to the bottom and not already loading, load more
      if (scrollHeight - scrollTop - clientHeight < 50 && !isLoading) {
        onLoadMore();
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Reset highlighted index when options change
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [options, isOpen]);

  return (
    <div
      className="relative w-full"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Selected option display / trigger button */}
      <div
        className={` ${
          size == "sm" ? "p-2" : "p-3"
        } flex items-center justify-between w-full  border border-gray-300 rounded-md bg-white cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`${!selectedOption ? "text-gray-400" : "text-gray-800"}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Options list */}
          <div
            ref={optionsRef}
            className="max-h-60 overflow-y-auto"
            onScroll={handleScroll}
          >
            {options?.length > 0 ? (
              options?.map((option, index) => (
                <div
                  key={option.value.toString()}
                  className={`px-4 py-2 cursor-pointer ${
                    highlightedIndex === index
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  } ${
                    option?.value === value ? "font-medium text-blue-600" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option?.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                No options available
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center p-4 border-t border-gray-200">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">
                  Loading more options...
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionSelector;
