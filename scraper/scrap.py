import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass


@dataclass
class City:
    name: str
    url: str
    country: str
    country_url: str
    country_flag: str

    def __str__(self):
        return f"{self.name} ({self.country})"


def scrape_all_cities():
    # url = "https://en.wikipedia.org/wiki/List_of_national_capitals"
    # print(f"Scraping cities from {url}")
    # response = requests.get(url)

    cities = []
    # if response.status_code == 200:
    rowspan_city = 0
    rowspan_country = 0
    with open('wikipedia.html', 'r') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

        table = soup.find('table', {'class': 'wikitable sortable'})
        tbody = table.find('tbody')
        for tr in tbody.find_all('tr'):
            tds = tr.find_all('td')

            if len(tds) < 2:
                print("Skipping empty row")
                continue

            if rowspan_city == 0:
                city = tds[0]

            if rowspan_country == 0:
                country = tds[1]

            city_a = city.find('a')

            if rowspan_city > 0:
                rowspan_city -= 1
            elif city.has_attr('rowspan'):
                print('City rowspan', city['rowspan'])
                rowspan_city = int(city['rowspan']) - 1

            city_name = city_a.text
            city_url = city_a['href']

            country_a = country.find('a')

            if rowspan_country > 0:
                rowspan_country -= 1
            elif country.has_attr('rowspan'):
                print('Country rowspan', country['rowspan'])
                rowspan_country = int(country['rowspan']) - 1

            country_name = country_a.text
            country_url = country_a['href']
            country_flag = country.find('img')['src']

            res = City(city_name, city_url, country_name,
                       country_url, country_flag)
            print(res)
            cities.append(res)
        return cities


if __name__ == "__main__":
    cities = scrape_all_cities()
    print(cities)
