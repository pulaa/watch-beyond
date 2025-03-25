import { watchRegions } from "@/data/region";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Tab, Tabs } from "@heroui/tabs";
import { useMemo, useState } from "react";

// Render a provider card with consistent styling
const renderProviderCard = (provider: any) => (
  <Card key={provider.provider_id}>
    <CardHeader className="justify-between">
      <div className="flex gap-5">
        <Avatar
          isBordered
          radius="md"
          size="md"
          src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
        />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {provider.provider_name}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            Available in{" "}
            <span className="font-bold text-blue-600">
              {provider.countries.length}
            </span>{" "}
            {provider.countries.length === 1 ? "country" : "countries"}
          </h5>
        </div>
      </div>
    </CardHeader>
    <CardBody>
      <ScrollShadow>
        <div className="flex flex-wrap gap-2 max-h-48">
          {provider.countries.map((country: string) => {
            // Find the full country name from the country code
            const countryInfo = watchRegions.find(
              (region) => region.value === country
            );
            return (
              <Chip
                key={country}
                color="default"
                startContent={
                  <Avatar
                    alt={countryInfo?.label || country}
                    className="w-6 h-6"
                    src={`https://flagcdn.com/${country.toLowerCase()}.svg`}
                  />
                }
                variant="flat"
              >
                {countryInfo?.label || country}
              </Chip>
            );
          })}
        </div>
      </ScrollShadow>
    </CardBody>
  </Card>
);

export default function WatchProviders({ providers }: any) {
  const [activeTab, setActiveTab] = useState("flatrate");

  // Helper function to get unique providers across all regions for a given type
  const getProvidersForType = (type: string) => {
    const providerMap = new Map();

    // Loop through each country/region
    Object.entries(providers?.results || {}).forEach(
      ([country, region]: [string, any]) => {
        if (region[type] && Array.isArray(region[type])) {
          region[type].forEach((provider: any) => {
            if (!providerMap.has(provider.provider_id)) {
              providerMap.set(provider.provider_id, {
                ...provider,
                countries: [country],
              });
            } else {
              const existingProvider = providerMap.get(provider.provider_id);
              existingProvider.countries.push(country);
              providerMap.set(provider.provider_id, existingProvider);
            }
          });
        }
      }
    );

    // Sort providers by number of countries (most available first)
    return Array.from(providerMap.values()).sort(
      (a, b) => b.countries.length - a.countries.length
    );
  };

  const flatrateProviders = useMemo(
    () => getProvidersForType("flatrate"),
    [providers]
  );
  const rentProviders = useMemo(() => getProvidersForType("rent"), [providers]);
  const buyProviders = useMemo(() => getProvidersForType("buy"), [providers]);

  return (
    <Tabs
      aria-label="watch providers"
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as string)}
    >
      <Tab
        key="flatrate"
        title={
          <div className="flex items-center gap-2">
            <span>Stream</span>
            {flatrateProviders.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {flatrateProviders.length}
              </span>
            )}
          </div>
        }
      >
        <>
          {flatrateProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
              {flatrateProviders.map(renderProviderCard)}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No streaming providers available for this title
              </p>
            </div>
          )}
        </>
      </Tab>
      <Tab
        key="rent"
        title={
          <div className="flex items-center gap-2">
            <span>Rent</span>
            {rentProviders.length > 0 && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                {rentProviders.length}
              </span>
            )}
          </div>
        }
      >
        <>
          {rentProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rentProviders.map(renderProviderCard)}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No rental options available for this title
              </p>
            </div>
          )}
        </>
      </Tab>
      <Tab
        key="buy"
        title={
          <div className="flex items-center gap-2">
            <span>Buy</span>
            {buyProviders.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {buyProviders.length}
              </span>
            )}
          </div>
        }
      >
        <>
          {buyProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buyProviders.map(renderProviderCard)}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No purchase options available for this title
              </p>
            </div>
          )}
        </>
      </Tab>
    </Tabs>
  );
}
