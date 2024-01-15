import requests
import bs4
from collections import namedtuple
import os
import json
from thefuzz import fuzz


CityBrief = namedtuple(
    'CityBrief', ['name', 'url', 'country', 'country_url', 'country_flag'])


def load_or_scrape_page(url, filename):
    CACHE = '.cache'
    cached_filename = CACHE + '/' + filename

    if os.path.exists(cached_filename) and filename:
        print(f"Reading from cache {cached_filename}")
        with open(cached_filename, 'r') as f:
            page = f.read()
    else:
        print(f"Scraping from {url}")
        response = requests.get(url)
        page = response.text
        if not os.path.exists(CACHE):
            os.makedirs(CACHE)
        with open(cached_filename, 'w') as f:
            f.write(page)

    return page


WIKIPEDIA = 'https://en.wikipedia.org'


def scrape_all_cities():
    page = load_or_scrape_page(
        WIKIPEDIA + "/wiki/List_of_national_capitals", 'capital_cities.html')
    soup = bs4.BeautifulSoup(page, 'html.parser')

    rowspan_city = 0
    rowspan_country = 0
    cities = []

    table = soup.find('table', {'class': 'wikitable sortable'})
    assert table
    tbody = table.find('tbody')
    assert type(tbody) == bs4.element.Tag
    for tr in tbody.find_all('tr'):
        tds = tr.find_all('td')

        if len(tds) < 1:
            print("Skipping empty row")
            continue

        if rowspan_city == 0:
            city = tds[0]

        if rowspan_country == 0 and len(tds) > 1:
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

        res = CityBrief(city_name, city_url, country_name,
                        country_url, country_flag)
        print(res)
        cities.append(res)
    return cities


CityDetails = namedtuple(
    'CityDetails', ['longitude', 'latitude', 'description', 'infobox'])


def scrap_city_details(city):
    page = load_or_scrape_page(
        WIKIPEDIA + city.url, city.name + '.html')
    soup = bs4.BeautifulSoup(page, 'html.parser')

    longitude = soup.find(
        'span', {'class': 'longitude'}).text.replace('\ufeff', '')
    latitude = soup.find(
        'span', {'class': 'latitude'}).text.replace('\ufeff', '')

    description = ''
    for paragraph in soup.find_all('p'):
        b = paragraph.find('b')
        if b and fuzz.partial_ratio(b.text, city.name) > 80:
            if paragraph.text.strip():
                description = paragraph.text.strip()
                break

    table = soup.find('table', {'class': 'infobox'})
    infobox = ''
    if table:
        for tr in table.find_all('tr'):
            th = tr.find('th')
            td = tr.find('td')
            if not th or not td:
                continue
            infobox += th.text.strip() + ': ' + td.text.strip() + '\n'
    infobox.replace('• ', '')
    infobox.replace('•', '')

    if not description:
        description = soup.find('p').text.strip()
    return CityDetails(longitude, latitude, description, infobox)


if __name__ == "__main__":
    cities = scrape_all_cities()
    details = (scrap_city_details(city) for city in cities)
    all_cities = []
    for brief, detail in zip(cities, details):
        brief_json = brief._asdict()
        detail_json = detail._asdict()
        brief_json.update(detail_json)
        print(brief_json)
        all_cities.append(brief_json)

    with open('../all_cities.json', 'w') as f:
        json.dump({"cities": all_cities}, f)
