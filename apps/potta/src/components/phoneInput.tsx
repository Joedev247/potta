"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Country } from "country-state-city";

interface BaseInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  whatsapp?: boolean;
  onChange?: (value: string, metadata: PhoneMetadata) => void;
}

interface PhoneMetadata {
  formattedValue: string;
  countryCode: string;
  rawInput: string;
}

interface PhoneInputProps extends BaseInputProps {
  countryCode?: string;
}

interface CountryCodeInfo {
  code: string;
  country: string;
  format: string;
  flag: string;
  isoCode: string;
  id: string; // Unique identifier
}

// Common phone number formats by region
const phoneFormats: Record<string, string> = {
  AF: "XX XXX XXXX", // Africa
  AS: "XXX XXXX XXXX", // Asia
  EU: "XXX XXX XXXX", // Europe
  NA: "XXX XXX XXXX", // North America
  SA: "XXX XXX XXXX", // South America
  OC: "XXX XXX XXX", // Oceania
  default: "XXX XXX XXXX",
};

// Helper to determine format based on continent/region
const getFormatForCountry = (isoCode: string): string => {
  // This is a simplified approach - in a real app you might want more specific formats
  const africanCountries = ["CM", "NG", "ZA", "KE", "GH", "SN", "CI"];
  const europeanCountries = ["GB", "FR", "DE", "IT", "ES", "NL"];
  const asianCountries = ["CN", "JP", "IN", "KR", "SG"];
  const northAmericanCountries = ["US", "CA", "MX"];

  if (africanCountries.includes(isoCode)) return phoneFormats.AF;
  if (europeanCountries.includes(isoCode)) return phoneFormats.EU;
  if (asianCountries.includes(isoCode)) return phoneFormats.AS;
  if (northAmericanCountries.includes(isoCode)) return phoneFormats.NA;

  return phoneFormats.default;
};

// Generate flag URL from country code
const getFlagUrl = (isoCode: string): string => {
  return `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`;
};

export function PhoneInput({
  label,
  placeholder,
  value = "",
  onChange,
  whatsapp,
  countryCode = "+237",
}: PhoneInputProps) {
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);
  const [isWhatsApp, setIsWhatsApp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(value);
  const [countryCodes, setCountryCodes] = useState<CountryCodeInfo[]>([]);
  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<CountryCodeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userSelectedCountry = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load country codes on component mount
  useEffect(() => {
    const loadCountryCodes = async () => {
      setIsLoading(true);
      try {
        const countries = Country.getAllCountries();

        // Create a map to handle duplicate country codes
        const codeMap = new Map<string, CountryCodeInfo[]>();

        countries.forEach((country) => {
          let callingCode = "";
          try {
            callingCode = `+${country.phonecode}`;
          } catch (error) {
            console.error(
              `Error getting calling code for ${country.name}:`,
              error
            );
            return; // Skip this country
          }

          if (!callingCode || callingCode === "+") return; // Skip invalid codes

          const countryInfo: CountryCodeInfo = {
            code: callingCode,
            country: country.name,
            format: getFormatForCountry(country.isoCode),
            flag: getFlagUrl(country.isoCode),
            isoCode: country.isoCode,
            id: `${country.isoCode}-${callingCode}`, // Create unique ID
          };

          if (!codeMap.has(callingCode)) {
            codeMap.set(callingCode, []);
          }
          codeMap.get(callingCode)?.push(countryInfo);
        });

        // Process the map to create a deduplicated array
        const processedCodes: CountryCodeInfo[] = [];
        codeMap.forEach((countries, code) => {
          countries.forEach((country) => {
            processedCodes.push(country);
          });
        });

        // Sort by country name for better UX
        processedCodes.sort((a, b) => a.country.localeCompare(b.country));

        setCountryCodes(processedCodes);

        // Set the initial selected country info
        const initialCountry =
          processedCodes.find((c) => c.code === countryCode) ||
          (processedCodes.length > 0 ? processedCodes[0] : null);

        if (initialCountry) {
          setSelectedCountryCode(initialCountry.code);
          setSelectedCountryInfo(initialCountry);
        }
      } catch (error) {
        console.error("Error loading country codes:", error);
        // Fallback to some default countries if API fails
        const fallbackCountries = [
          {
            code: "+237",
            country: "Cameroon",
            format: "X XX XX XX XX",
            flag: getFlagUrl("CM"),
            isoCode: "CM",
            id: "CM-237",
          },
          {
            code: "+1",
            country: "United States",
            format: "XXX XXX XXXX",
            flag: getFlagUrl("US"),
            isoCode: "US",
            id: "US-1",
          },
          {
            code: "+44",
            country: "United Kingdom",
            format: "XXXX XXXXXX",
            flag: getFlagUrl("GB"),
            isoCode: "GB",
            id: "GB-44",
          },
        ];
        setCountryCodes(fallbackCountries);

        // Set initial country from fallback
        const initialCountry =
          fallbackCountries.find((c) => c.code === countryCode) ||
          fallbackCountries[0];
        setSelectedCountryCode(initialCountry.code);
        setSelectedCountryInfo(initialCountry);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountryCodes();
  }, [countryCode]);

  // Update phone number when value prop changes
  useEffect(() => {
    if (value !== phoneNumber) {
      setPhoneNumber(value);

      // Only auto-detect country if the user hasn't manually selected one
      if (!userSelectedCountry.current) {
        detectCountryFromNumber(value);
      }
    }
  }, [value]);

  // Update selected country info when country code changes
  useEffect(() => {
    const countryInfo =
      countryCodes.find((c) => c.code === selectedCountryCode) || null;
    if (countryInfo) {
      setSelectedCountryInfo(countryInfo);
    }
  }, [selectedCountryCode, countryCodes]);

  // Detect country code from phone number - only used for initial detection
  const detectCountryFromNumber = (number: string) => {
    if (!number || countryCodes.length === 0 || userSelectedCountry.current)
      return;

    // Remove all non-digit characters
    const digitsOnly = number.replace(/\D/g, "");
    if (digitsOnly.length < 4) return; // Too short to reliably detect

    // Try to match the number against country codes
    // Sort by code length (descending) to match longer codes first
    const sortedCodes = [...countryCodes].sort(
      (a, b) =>
        b.code.replace(/\D/g, "").length - a.code.replace(/\D/g, "").length
    );

    for (const country of sortedCodes) {
      const codeDigits = country.code.replace(/\D/g, "");
      if (digitsOnly.startsWith(codeDigits)) {
        setSelectedCountryCode(country.code);
        return;
      }
    }
  };

  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, "");
    if (cleaned.length === 0) return "";

    const format = selectedCountryInfo?.format || "XXX XXX XXX";

    let formatted = "";
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < cleaned.length; i++) {
      if (format[i] === "X") {
        formatted += cleaned[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
        if (digitIndex < cleaned.length) {
          formatted += "";
        }
      }
    }

    return formatted;
  };

  // Notify parent component with combined value and metadata
  const notifyChange = (formattedValue: string) => {
    if (onChange) {
      const rawInput = formattedValue.replace(/\D/g, "");
      const combinedValue = `${selectedCountryCode}${rawInput}`;

      // Pass combined value and metadata to parent
      onChange(combinedValue, {
        formattedValue,
        countryCode: selectedCountryCode,
        rawInput
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digitsOnly = input.replace(/\D/g, "");
    const maxLength = 15; // Standard max length for international numbers

    if (digitsOnly.length <= maxLength) {
      const formatted = formatPhoneNumber(digitsOnly);
      setPhoneNumber(formatted);
      notifyChange(formatted);
    }
  };

  const handleCountryCodeChange = (country: CountryCodeInfo) => {
    setSelectedCountryCode(country.code);
    setSelectedCountryInfo(country);
    setDropdownOpen(false);

    // Mark that the user has manually selected a country
    userSelectedCountry.current = true;

    // Notify parent with updated country code
    notifyChange(phoneNumber);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        <p className="font-bold mb-1 w-fit">{label}</p>
        {whatsapp && (
          <WhatsAppToggle checked={isWhatsApp} onChange={setIsWhatsApp} />
        )}
      </div>
      <div className="flex gap-[1px]">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center py-2.5 border border-r-0 border-gray-200 px-3 bg-white cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none min-w-[90px] justify-between"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              {selectedCountryInfo && (
                <div className="w-5 h-4 relative overflow-hidden">
                  <img
                    src={selectedCountryInfo.flag}
                    alt={`${selectedCountryInfo.country} flag`}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <span>{selectedCountryCode}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 z-10 bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto w-64">
              {isLoading ? (
                <div className="p-3 text-center">Loading countries...</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {countryCodes.map((country) => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleCountryCodeChange(country)}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 text-left"
                    >
                      <div className="w-6 h-4 relative overflow-hidden">
                        <img
                          src={country.flag}
                          alt={`${country.country} flag`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {country.country}
                        </div>
                        <div className="text-xs text-gray-500">
                          {country.code}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <input
          type="tel"
          placeholder={placeholder}
          value={phoneNumber}
          onChange={handleInputChange}
          className="outline-none focus:ring-1 focus:ring-blue-500 border border-gray-200 p-2 flex-1 py-2.5"
        />
      </div>
      {selectedCountryInfo && (
        <div className="text-xs text-gray-500 mt-1">
          {selectedCountryInfo.country} ({selectedCountryInfo.code})
        </div>
      )}
    </div>
  );
}

interface WhatsAppToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function WhatsAppToggle({ checked, onChange }: WhatsAppToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span>WhatsApp No?</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-green-500" : "bg-gray-300"
        } relative`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
            checked ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
