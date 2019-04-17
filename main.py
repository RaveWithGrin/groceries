import requests
import json
from bs4 import BeautifulSoup
from pprint import pprint
from datetime import datetime
import re


def get_groceries(url, store):
    response = requests.get(url)
    json_response = json.loads(response.text)
    groceries = {}
    for item in json_response['items']:
        if len(item['category_names']) > 0:
            if item['category_names'][0] not in groceries:
                groceries[item['category_names'][0]] = []
            groceries[item['category_names'][0]].append({
                'name': item['name'],
                'description': item['description'],
                'price': item['current_price'],
                'price_text': item['price_text'],
                'valid_from': datetime.strptime(item['valid_from'], '%Y-%m-%d'),
                'valid_to': datetime.strptime(item['valid_to'], '%Y-%m-%d'),
                'image': re.sub(r'https', 'http', item['large_image_url']),
                'store': store
            })
    for category in groceries:
        groceries[category].sort(key=lambda x: x['name'])
    return groceries


groceries = {}
stores = [{
    'name': 'No Frills',
    'url': 'http://flyers.nofrills.ca/flyer_data/2496238?locale=en'
}, {
    'name': 'Food Basics',
    'url': 'http://ecirculaire.foodbasics.ca/flyer_data/2483336?locale=en'
}, {
    'name': 'Metro',
    'url': 'http://ecirculaire.metro.ca/flyer_data/2486720?locale=en'
}, {
    'name': 'Fortinos',
    'url': 'http://flyers.fortinos.ca/flyer_data/2487869?locale=en'
}, {
    'name': 'Lococos',
    'url': 'http://flyer.lococos.ca/flyer_data/2464276?locale=en'
}, {
    'name': 'Walmart',
    'url': 'http://flyers.walmart.ca/flyer_data/2486735?locale=en'
}]

# for store in stores:
store = stores[-1]
groceries[store['name']] = get_groceries(store['url'], store['name'])
pprint(groceries)
